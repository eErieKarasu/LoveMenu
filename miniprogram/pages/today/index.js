const {
  TODAY_MEALS,
  addRecipeIngredients,
  dateKeyForDate,
  mealContextForHour,
  removeRecipeFromTodayMeal,
  selectedTodayRecipes,
  todayRecipeIds
} = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

Page({
  data: {
    loading: true,
    meals: [],
    recent: [],
    dateLabel: "",
    summaryText: "",
    selectedCount: 0,
    plannedMealCount: 0,
    totalTime: 0
  },

  async onShow() {
    selectTab(this, 0);
    await app.ensureReady();
    app.clearTodayMealTarget();
    if (app.getState().todayPlan.dateKey !== dateKeyForDate()) app.update(() => {});
    this.refresh();
  },

  refresh() {
    const state = app.getState();
    const now = new Date();
    const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()];
    const currentMeal = mealContextForHour(now.getHours());
    const meals = TODAY_MEALS.map((meal) => {
      const dishes = selectedTodayRecipes(state, meal.key).map((recipe) => ({
        ...recipe,
        initial: recipe.name.charAt(0),
        categoryLabel: recipe.categories[0] || "家常菜"
      }));
      const totalTime = dishes.reduce((sum, recipe) => sum + (Number(recipe.time) || 0), 0);
      return {
        ...meal,
        dishes,
        totalTime,
        isCurrent: meal.key === currentMeal.key,
        statusText: dishes.length ? `${dishes.length} 道 · 约 ${totalTime} 分钟` : "待安排",
        actionText: dishes.length ? "再加一道" : `安排${meal.label}`,
        actionQuiet: dishes.length || meal.key !== currentMeal.key
      };
    });
    const todayIds = todayRecipeIds(state);
    const selectedIds = new Set(todayIds);
    const selectedCount = todayIds.length;
    const plannedMealCount = meals.filter((meal) => meal.dishes.length).length;
    const totalTime = meals.reduce((sum, meal) => sum + meal.totalTime, 0);
    const summaryText = selectedCount
      ? `已安排 ${plannedMealCount}/3 餐 · 共 ${selectedCount} 道菜 · 约 ${totalTime} 分钟`
      : "把三餐慢慢安排好，今天吃得更从容。";

    this.setData({
      loading: false,
      meals,
      recent: state.recipes
        .filter((recipe) => !selectedIds.has(recipe.id))
        .slice(0, 6)
        .map((recipe) => ({ ...recipe, tagSummary: recipe.tags.slice(0, 2).join(" / ") })),
      dateLabel: `${now.getMonth() + 1}月${now.getDate()}日 ${week}`,
      summaryText,
      selectedCount,
      plannedMealCount,
      totalTime
    });
  },

  goRecipes(event) {
    app.setTodayMealTarget(event.currentTarget.dataset.meal || "");
    wx.switchTab({ url: "/pages/recipes/index" });
  },

  openRecipe(event) {
    wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` });
  },

  removeDish(event) {
    const { id, meal } = event.currentTarget.dataset;
    app.update((state) => { removeRecipeFromTodayMeal(state, id, meal); });
    this.refresh();
  },

  addAllToGrocery() {
    const ids = Array.from(new Set(todayRecipeIds(app.getState())));
    app.update((state) => ids.forEach((id) => addRecipeIngredients(state, id)));
    wx.showToast({ title: "已汇总今日缺货", icon: "success" });
  }
});
