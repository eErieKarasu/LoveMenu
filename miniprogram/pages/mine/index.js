const app = getApp();

Page({
  data: { recipeCount: 0, favoriteCount: 0, groceryCount: 0, syncStatus: "", cloudEnabled: false },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const state = app.getState();
    this.setData({
      recipeCount: state.recipes.length,
      favoriteCount: state.recipes.filter((recipe) => recipe.favorite).length,
      groceryCount: state.groceries.filter((item) => !item.checked).length,
      syncStatus: app.globalData.syncStatus,
      cloudEnabled: app.globalData.cloudEnabled
    });
  },
  async syncNow() {
    wx.showLoading({ title: "同步中" });
    await app.persist();
    wx.hideLoading();
    this.refresh();
    wx.showToast({ title: app.globalData.syncStatus, icon: "none" });
  }
});
