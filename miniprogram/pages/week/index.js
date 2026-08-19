const { buildWeekPlan } = require("../../utils/domain");
const app = getApp();

Page({
  data: { loading: true, selectedDay: 0, weekPlan: [], selected: null, hasRecipes: false },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const state = app.getState();
    const weekPlan = state.weekPlan;
    const hasRecipes = state.recipes.length > 0;
    const selectedDay = Math.min(this.data.selectedDay, weekPlan.length - 1);
    this.setData({ loading: false, weekPlan, selectedDay, hasRecipes, selected: hasRecipes ? weekPlan[selectedDay] : null });
  },
  selectDay(event) { this.setData({ selectedDay: Number(event.currentTarget.dataset.index) }, () => this.refresh()); },
  goRecipes() { wx.switchTab({ url: "/pages/recipes/index" }); },
  regenerate() {
    if (!app.getState().recipes.length) {
      wx.showToast({ title: "请先添加菜谱", icon: "none" });
      return;
    }
    const offset = Math.floor(Math.random() * Math.max(1, app.getState().recipes.length));
    app.update((state) => { state.weekPlan = buildWeekPlan(state.recipes, offset); });
    this.refresh();
    wx.showToast({ title: "已换一套菜单", icon: "success" });
  }
});
