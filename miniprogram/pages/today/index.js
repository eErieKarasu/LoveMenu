const {
  TODAY_MEALS,
  dateKeyForDate,
  mealContextForHour,
  removeRecipeFromTodayMeal,
  selectedTodayRecipes,
  syncTodayGroceries,
  todayRecipeIds
} = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const { recentRecipeCard } = require("../../utils/today");
const app = getApp();

const MEAL_ICONS = {
  breakfast: "/assets/icons/meal-breakfast.svg",
  lunch: "/assets/icons/meal-lunch.svg",
  dinner: "/assets/icons/meal-dinner.svg"
};

const MEAL_ILLUSTRATIONS = {
  lunch: "/assets/illustrations/meal-lunch-bowl.svg",
  dinner: "/assets/illustrations/meal-dinner-pot.svg"
};

Page({
  data: {
    loading: true,
    meals: [],
    recentRecipe: null,
    dateLabel: "",
    selectedCount: 0,
    plannedMealCount: 0,
    totalTime: 0
  },

  async onShow() {
    selectTab(this, 0);
    await app.ensureReady();
    app.clearTodayMealTarget();
    if (app.getState().todayPlan.dateKey !== dateKeyForDate()) app.update((state) => syncTodayGroceries(state));
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
        categoryLabel: recipe.categories[0] || "家常菜",
        imageSrc: recipe.image || ""
      }));
      const totalTime = dishes.reduce((sum, recipe) => sum + (Number(recipe.time) || 0), 0);
      return {
        ...meal,
        dishes,
        totalTime,
        isCurrent: meal.key === currentMeal.key,
        statusText: dishes.length ? `${dishes.length} 道 · 约 ${totalTime} 分钟` : "待安排",
        actionText: dishes.length ? "再加一道" : `安排${meal.label}`,
        iconSrc: meal.key === currentMeal.key
          ? MEAL_ICONS[meal.key].replace(".svg", "-active.svg")
          : MEAL_ICONS[meal.key],
        illustrationSrc: MEAL_ILLUSTRATIONS[meal.key] || ""
      };
    });
    const todayIds = todayRecipeIds(state);
    const selectedIds = new Set(todayIds);
    const selectedCount = todayIds.length;
    const plannedMealCount = meals.filter((meal) => meal.dishes.length).length;
    const totalTime = meals.reduce((sum, meal) => sum + meal.totalTime, 0);
    this.setData({
      loading: false,
      meals,
      recentRecipe: recentRecipeCard(state.recipes.find((recipe) => !selectedIds.has(recipe.id)) || state.recipes[0]),
      dateLabel: `${now.getMonth() + 1}月${now.getDate()}日 ${week}`,
      selectedCount,
      plannedMealCount,
      totalTime
    });
  },

  openProfile() {
    wx.navigateTo({ url: "/pages/profile/index" });
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

  openMealMenu(event) {
    const mealKey = event.currentTarget.dataset.meal;
    const meal = this.data.meals.find((item) => item.key === mealKey);
    if (!meal || !meal.dishes.length) return;
    const dishes = meal.dishes.slice(0, 6);
    wx.showActionSheet({
      itemList: dishes.map((dish) => `移除${dish.name}`),
      success: ({ tapIndex }) => {
        app.update((state) => { removeRecipeFromTodayMeal(state, dishes[tapIndex].id, mealKey); });
        this.refresh();
      }
    });
  }
});
