const { addRecipeIngredients, recipeById } = require("../../utils/domain");
const app = getApp();

Page({
  data: { id: "", recipe: null },
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
    this.setData({ recipe, scores });
    wx.setNavigationBarTitle({ title: recipe.name });
  },
  toggleFavorite() {
    app.update((state) => { const recipe = recipeById(state, this.data.id); recipe.favorite = !recipe.favorite; });
    this.refresh();
  },
  addToday() {
    let added = false;
    app.update((state) => {
      if (!state.selectedToday.includes(this.data.id)) { state.selectedToday.push(this.data.id); added = true; }
    });
    wx.showToast({ title: added ? "已加入今日菜单" : "已经选过啦", icon: "none" });
  },
  addGrocery() {
    app.update((state) => addRecipeIngredients(state, this.data.id));
    wx.showToast({ title: "已加入采购清单", icon: "success" });
  },
  editRecipe() { wx.navigateTo({ url: `/pages/editor/index?id=${this.data.id}` }); }
});
