const { GROCERY_GROUPS } = require("../../utils/constants");
const { movePurchasedToInventory } = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

Page({
  data: { loading: true, groups: [] },
  async onShow() { selectTab(this, 2); await app.ensureReady(); this.refresh(); },
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
    wx.showModal({
      title: "完成采购",
      content: `将已勾选的 ${count} 项食材加入库存，并从采购清单移除。`,
      confirmText: "确认入库",
      success: (result) => {
        if (!result.confirm) return;
        app.update((state) => movePurchasedToInventory(state));
        wx.showToast({ title: `已入库 ${count} 项`, icon: "success" });
        this.refresh();
      }
    });
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
