const { createInitialState } = require("./utils/data");
const { normalizeState, syncTodayGroceries } = require("./utils/domain");
const stateService = require("./services/state");
const { CLOUD_ENV_ID } = require("./env");

App({
  globalData: {
    state: createInitialState(),
    ready: false,
    syncStatus: "正在读取菜单",
    cloudEnabled: false
  },

  onLaunch() {
    if (wx.cloud) {
      const cloudOptions = { traceUser: true };
      if (CLOUD_ENV_ID) cloudOptions.env = CLOUD_ENV_ID;
      wx.cloud.init(cloudOptions);
      this.globalData.cloudEnabled = true;
    }
    this.readyPromise = this.bootstrap();
  },

  async bootstrap() {
    const result = await stateService.loadState(this.globalData.state);
    const migrated = !result.state || result.state.version !== 5;
    this.globalData.state = normalizeState(result.state);
    const groceriesSynced = syncTodayGroceries(this.globalData.state);
    this.globalData.ready = true;
    this.globalData.syncStatus = result.source === "cloud"
      ? "已同步到微信云"
      : result.error ? result.error.message : "当前使用本地缓存";
    if (migrated || groceriesSynced || (result.source === "local" && this.globalData.cloudEnabled)) this.scheduleSave();
    return this.globalData.state;
  },

  ensureReady() {
    return this.readyPromise || Promise.resolve(this.globalData.state);
  },

  getState() {
    return this.globalData.state;
  },

  setTodayMealTarget(mealKey) {
    this.globalData.todayMealTarget = mealKey || "";
  },

  getTodayMealTarget() {
    return this.globalData.todayMealTarget || "";
  },

  clearTodayMealTarget() {
    this.globalData.todayMealTarget = "";
  },

  update(mutator) {
    mutator(this.globalData.state);
    this.globalData.state = normalizeState(this.globalData.state);
    syncTodayGroceries(this.globalData.state);
    this.scheduleSave();
    return this.globalData.state;
  },

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.globalData.syncStatus = "正在保存更改";
    this.saveTimer = setTimeout(() => this.persist(), 450);
  },

  async persist() {
    try {
      const result = await stateService.saveState(this.globalData.state);
      this.globalData.syncStatus = result.source === "cloud" ? "已同步到微信云" : "已保存到本机";
    } catch (error) {
      this.globalData.syncStatus = error.message || "云同步失败，已保存在本机";
    }
  }
});
