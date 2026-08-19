const { CATEGORIES } = require("../../utils/constants");
const app = getApp();

Page({
  data: {
    loading: true,
    categories: CATEGORIES,
    category: "全部",
    query: "",
    recipes: [],
    emptyTitle: "还没有菜谱",
    emptyCopy: "点击右上角的加号，记录第一道家常菜。"
  },
  async onShow() { await app.ensureReady(); this.filter(); },
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
  addToday(event) {
    const id = event.currentTarget.dataset.id;
    let added = false;
    app.update((state) => {
      if (!state.selectedToday.includes(id)) { state.selectedToday.push(id); added = true; }
    });
    wx.showToast({ title: added ? "已加入今日菜单" : "已经选过啦", icon: "none" });
  }
});
