const { CATEGORIES } = require("../../utils/constants");
const { TODAY_MEALS, addRecipeToTodayMeal } = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

function mealLabel(mealKey) {
  const meal = TODAY_MEALS.find((item) => item.key === mealKey);
  return meal ? meal.label : "";
}

Page({
  data: {
    loading: true,
    categories: CATEGORIES,
    category: "全部",
    query: "",
    recipes: [],
    mealTarget: "",
    mealTargetLabel: "",
    emptyTitle: "还没有菜谱",
    emptyCopy: "点击右上角的加号，记录第一道家常菜。"
  },
  async onShow() {
    selectTab(this, 1);
    await app.ensureReady();
    const mealTarget = app.getTodayMealTarget();
    this.setData({ mealTarget, mealTargetLabel: mealLabel(mealTarget) });
    this.filter();
  },
  filter() {
    const { category, query } = this.data;
    const normalized = query.trim().toLowerCase();
    const allRecipes = app.getState().recipes;
    const recipes = allRecipes.filter((recipe) => {
      const categoryMatch = category === "全部" || recipe.categories.includes(category);
      const haystack = `${recipe.name} ${recipe.ingredients.join(" ")} ${recipe.tags.join(" ")}`.toLowerCase();
      return categoryMatch && haystack.includes(normalized);
    }).map((recipe) => ({
      ...recipe,
      ingredientText: recipe.ingredients.join("、"),
      inventoryText: recipe.inventorySummary.text,
      inventoryReady: recipe.inventorySummary.ready
    }));
    this.setData({
      loading: false,
      recipes,
      emptyTitle: allRecipes.length ? "没有找到合适的菜" : "还没有菜谱",
      emptyCopy: allRecipes.length ? "换个关键词或分类试试。" : "点击右上角的加号，记录第一道家常菜。"
    });
  },
  onSearch(event) { this.setData({ query: event.detail.value }, () => this.filter()); },
  selectCategory(event) { this.setData({ category: event.currentTarget.dataset.value }, () => this.filter()); },
  openRecipe(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` }); },
  openEditor() { wx.navigateTo({ url: "/pages/editor/index" }); },
  clearMealTarget() {
    app.clearTodayMealTarget();
    this.setData({ mealTarget: "", mealTargetLabel: "" });
  },
  addToday(event) {
    const id = event.currentTarget.dataset.id;
    const target = app.getTodayMealTarget();
    if (target) {
      this.addToMeal(id, target);
      return;
    }
    wx.showActionSheet({
      itemList: TODAY_MEALS.map((meal) => `加入${meal.label}`),
      success: ({ tapIndex }) => this.addToMeal(id, TODAY_MEALS[tapIndex].key)
    });
  },
  addToMeal(id, mealKey) {
    let added = false;
    app.update((state) => { added = addRecipeToTodayMeal(state, id, mealKey); });
    app.clearTodayMealTarget();
    this.setData({ mealTarget: "", mealTargetLabel: "" });
    wx.showToast({ title: added ? `已加入${mealLabel(mealKey)}` : `${mealLabel(mealKey)}已有这道菜`, icon: "none" });
  }
});
