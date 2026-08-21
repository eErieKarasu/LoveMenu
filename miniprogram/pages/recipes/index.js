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
    createSheetVisible: false,
    createSheetActive: false,
    createSheetStyle: "",
    emptyTitle: "还没有菜谱",
    emptyCopy: "点击右上角的加号，记录第一道家常菜。"
  },
  async onShow() {
    this.createNavigating = false;
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
      initial: recipe.name.charAt(0),
      imageSrc: recipe.image || "",
      ingredientPreview: `${recipe.ingredients.slice(0, 3).join("、")}${recipe.ingredients.length > 3 ? "…" : ""}`,
      typeLabel: recipe.categories[0] || "家常菜",
      inventoryText: recipe.inventorySummary.totalCount
        ? `家里已有 ${recipe.inventorySummary.availableCount}/${recipe.inventorySummary.totalCount} · ${recipe.inventorySummary.shortageCount ? `还缺 ${recipe.inventorySummary.shortageCount} 样` : "食材已齐"}`
        : "还没有录入食材",
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
  inspire() {
    const recipes = app.getState().recipes;
    if (!recipes.length) { wx.showToast({ title: "先记录几道家常菜吧", icon: "none" }); return; }
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    wx.navigateTo({ url: `/pages/detail/index?id=${recipe.id}` });
  },
  openRecipe(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` }); },
  toggleFavorite(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => {
      const recipe = state.recipes.find((item) => item.id === id);
      if (recipe) recipe.favorite = !recipe.favorite;
    });
    this.filter();
  },
  openCreateSheet() {
    if (this.createSheetTimer) clearTimeout(this.createSheetTimer);
    this.setCreateTabBarLocked(true);
    this.setData({ createSheetVisible: true, createSheetStyle: "" }, () => {
      wx.nextTick(() => this.setData({ createSheetActive: true }));
    });
  },
  setCreateTabBarLocked(locked) {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar && tabBar.setData) tabBar.setData({ locked });
  },
  closeCreateSheet() {
    if (!this.data.createSheetVisible) return;
    this.setData({ createSheetActive: false, createSheetStyle: "" });
    this.createSheetTimer = setTimeout(() => {
      this.setData({ createSheetVisible: false });
      this.setCreateTabBarLocked(false);
      this.createSheetTimer = null;
    }, 240);
  },
  stopPropagation() {},
  onSheetTouchStart(event) {
    const touch = event.touches && event.touches[0];
    if (!touch) return;
    this.sheetTouchStartY = touch.clientY;
    this.sheetTouchStartedAt = Date.now();
  },
  onSheetTouchMove(event) {
    const touch = event.touches && event.touches[0];
    if (!touch || typeof this.sheetTouchStartY !== "number") return;
    const distance = Math.max(0, touch.clientY - this.sheetTouchStartY);
    this.sheetDragDistance = distance;
    this.setData({ createSheetStyle: `transform: translateY(${distance}px);` });
  },
  onSheetTouchEnd() {
    const distance = this.sheetDragDistance || 0;
    const elapsed = Math.max(1, Date.now() - (this.sheetTouchStartedAt || Date.now()));
    this.sheetTouchStartY = undefined;
    this.sheetDragDistance = 0;
    if (distance > 72 || distance / elapsed > 0.55) {
      this.closeCreateSheet();
      return;
    }
    this.setData({ createSheetStyle: "" });
  },
  openManualEditor() {
    if (this.createNavigating) return;
    this.createNavigating = true;
    this.closeCreateSheet();
    this.createNavigationTimer = setTimeout(() => wx.navigateTo({
      url: "/pages/editor/index",
      fail: () => { this.createNavigating = false; }
    }), 180);
  },
  openAiEditor() {
    if (this.createNavigating) return;
    this.createNavigating = true;
    this.closeCreateSheet();
    this.createNavigationTimer = setTimeout(() => wx.navigateTo({
      url: "/pages/ai-editor/index",
      fail: () => { this.createNavigating = false; }
    }), 180);
  },
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
  },
  onUnload() {
    if (this.createSheetTimer) clearTimeout(this.createSheetTimer);
    if (this.createNavigationTimer) clearTimeout(this.createNavigationTimer);
    this.setCreateTabBarLocked(false);
  }
});
