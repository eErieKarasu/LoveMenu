const { addRecipeIngredients, mealContextForHour, selectedTodayRecipes } = require("../../utils/domain");
const app = getApp();

Page({
  data: {
    loading: true,
    selected: [],
    recent: [],
    dateLabel: "",
    period: "",
    titleText: "",
    subtitleText: "",
    totalTime: 0
  },

  async onShow() {
    await app.ensureReady();
    this.refresh();
  },

  refresh() {
    const state = app.getState();
    const now = new Date();
    const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()];
    const selected = selectedTodayRecipes(state).map((recipe) => ({ ...recipe, initial: recipe.name.charAt(0) }));
    const mealContext = mealContextForHour(now.getHours());
    this.setData({
      loading: false,
      selected,
      recent: state.recipes.slice(0, 6).map((recipe) => ({ ...recipe, tagSummary: recipe.tags.slice(0, 2).join(" / ") })),
      dateLabel: `${now.getMonth() + 1}月${now.getDate()}日 ${week}`,
      period: mealContext.period,
      titleText: selected.length ? `${mealContext.period}已选菜单` : mealContext.prompt,
      subtitleText: selected.length ? "按家里真实想吃的来，不需要凑齐固定搭配。" : "还没决定，选一道今天真正想吃的。",
      totalTime: selected.reduce((sum, recipe) => sum + recipe.time, 0)
    });
  },

  goRecipes() { wx.switchTab({ url: "/pages/recipes/index" }); },
  openRecipe(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` }); },
  removeDish(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => { state.selectedToday = state.selectedToday.filter((item) => item !== id); });
    this.refresh();
  },
  addAllToGrocery() {
    const ids = app.getState().selectedToday.slice();
    app.update((state) => ids.forEach((id) => addRecipeIngredients(state, id)));
    wx.showToast({ title: "已加入采购清单", icon: "success" });
  }
});
