const app = getApp();
const { getLocalAiProvider } = require("../../utils/ai-config");

Page({
  data: {
    loading: true,
    recipeCount: 0,
    inventoryCount: 0,
    groceryCount: 0,
    syncStatus: "正在读取菜单",
    aiConfigStatus: "跟随云端"
  },

  async onShow() {
    await app.ensureReady();
    const state = app.getState();
    this.setData({
      loading: false,
      recipeCount: state.recipes.length,
      inventoryCount: state.inventory.length,
      groceryCount: state.groceries.filter((item) => !item.checked).length,
      syncStatus: app.globalData.syncStatus,
      aiConfigStatus: getLocalAiProvider() ? "本机配置" : "跟随云端"
    });
  },

  goRecipes() {
    wx.switchTab({ url: "/pages/recipes/index" });
  },

  goInventory() {
    wx.switchTab({ url: "/pages/inventory/index" });
  },

  goGrocery() {
    wx.switchTab({ url: "/pages/grocery/index" });
  },

  openAiSettings() {
    wx.navigateTo({ url: "/pages/ai-settings/index" });
  }
});
