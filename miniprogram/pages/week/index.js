const { buildWeekPlan } = require("../../utils/domain");
const app = getApp();

Page({
  data: { loading: true, selectedDay: 0, weekPlan: [], selected: null },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const weekPlan = app.getState().weekPlan;
    const selectedDay = Math.min(this.data.selectedDay, weekPlan.length - 1);
    this.setData({ loading: false, weekPlan, selectedDay, selected: weekPlan[selectedDay] });
  },
  selectDay(event) { this.setData({ selectedDay: Number(event.currentTarget.dataset.index) }, () => this.refresh()); },
  regenerate() {
    const offset = Math.floor(Math.random() * Math.max(1, app.getState().recipes.length));
    app.update((state) => { state.weekPlan = buildWeekPlan(state.recipes, offset); });
    this.refresh();
    wx.showToast({ title: "已换一套菜单", icon: "success" });
  }
});
