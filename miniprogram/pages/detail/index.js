const { TODAY_MEALS, addRecipeToTodayMeal, recipeById } = require("../../utils/domain");
const app = getApp();

function mealLabel(mealKey) {
  const meal = TODAY_MEALS.find((item) => item.key === mealKey);
  return meal ? meal.label : "";
}

Page({
  data: { id: "", recipe: null, mealTargetLabel: "" },
  onLoad(options) { this.setData({ id: options.id || "" }); },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const recipe = recipeById(app.getState(), this.data.id);
    if (!recipe) { wx.showToast({ title: "菜谱不存在", icon: "none" }); return; }
    const scores = [
      { mark: "我", name: `我：${recipe.likes["我"]}`, note: "默认口味" },
      { mark: "伴", name: `伴侣：${recipe.likes["伴侣"]}`, note: "晚餐参考" },
      { mark: "小", name: `小朋友：${recipe.likes["小朋友"]}`, note: "少辣优先" }
    ];
    this.setData({ recipe, scores, mealTargetLabel: mealLabel(app.getTodayMealTarget()) });
  },
  toggleFavorite() {
    app.update((state) => { const recipe = recipeById(state, this.data.id); recipe.favorite = !recipe.favorite; });
    this.refresh();
  },
  addToday() {
    const target = app.getTodayMealTarget();
    if (target) {
      this.addToMeal(target);
      return;
    }
    wx.showActionSheet({
      itemList: TODAY_MEALS.map((meal) => `加入${meal.label}`),
      success: ({ tapIndex }) => this.addToMeal(TODAY_MEALS[tapIndex].key)
    });
  },
  addToMeal(mealKey) {
    let added = false;
    app.update((state) => { added = addRecipeToTodayMeal(state, this.data.id, mealKey); });
    app.clearTodayMealTarget();
    this.setData({ mealTargetLabel: "" });
    wx.showToast({ title: added ? `已加入${mealLabel(mealKey)}` : `${mealLabel(mealKey)}已有这道菜`, icon: "none" });
  },
  editRecipe() { wx.navigateTo({ url: `/pages/editor/index?id=${this.data.id}` }); }
});
