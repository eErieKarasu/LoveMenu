const { GROCERY_GROUPS } = require("../../utils/constants");
const { movePurchasedToInventory } = require("../../utils/domain");
const app = getApp();

Page({
  data: { loading: true, groups: [] },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const groceries = app.getState().groceries;
    const groups = GROCERY_GROUPS.map((name) => ({
      name,
      items: groceries.filter((item) => item.category === name).map((item) => ({
        ...item,
        quantityText: `${item.quantity} ${item.unit}`,
        sourceText: item.source.join("、")
      }))
    })).filter((group) => group.items.length);
    this.setData({ loading: false, groups });
  },
  toggleItem(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => { const item = state.groceries.find((entry) => entry.id === id); if (item) item.checked = !item.checked; });
    this.refresh();
  },
  completePurchased() {
    const count = app.getState().groceries.filter((item) => item.checked).length;
    if (!count) { wx.showToast({ title: "还没有已购买项目", icon: "none" }); return; }
    wx.showActionSheet({ itemList: ["已购买并加入库存", "仅从采购清单移除"], success: (result) => {
      if (result.tapIndex === 0) {
        app.update((state) => movePurchasedToInventory(state));
        wx.showToast({ title: `已入库 ${count} 项`, icon: "success" });
      } else {
        app.update((state) => { state.groceries = state.groceries.filter((item) => !item.checked); });
      }
      this.refresh();
    }});
  },
  copyList() {
    const text = app.getState().groceries
      .filter((item) => !item.checked)
      .map((item) => `□ ${item.name} × ${item.quantity} ${item.unit}（${item.source.join("、")}）`)
      .join("\n");
    if (!text) { wx.showToast({ title: "没有待采购食材", icon: "none" }); return; }
    wx.setClipboardData({ data: text });
  }
});
