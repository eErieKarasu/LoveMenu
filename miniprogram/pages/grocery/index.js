const { GROCERY_GROUPS } = require("../../utils/constants");
const app = getApp();

Page({
  data: { loading: true, groups: [] },
  async onShow() { await app.ensureReady(); this.refresh(); },
  refresh() {
    const groceries = app.getState().groceries;
    const groups = GROCERY_GROUPS.map((name) => ({ name, items: groceries.filter((item) => item.category === name).map((item) => ({ ...item, sourceText: item.source.join("、") })) })).filter((group) => group.items.length);
    this.setData({ loading: false, groups });
  },
  toggleItem(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => { const item = state.groceries.find((entry) => entry.id === id); if (item) item.checked = !item.checked; });
    this.refresh();
  },
  clearPurchased() {
    const count = app.getState().groceries.filter((item) => item.checked).length;
    if (!count) { wx.showToast({ title: "还没有已购买项目", icon: "none" }); return; }
    wx.showModal({ title: "清空已购买", content: `将移除 ${count} 项已购买食材`, success: (result) => {
      if (!result.confirm) return;
      app.update((state) => { state.groceries = state.groceries.filter((item) => !item.checked); });
      this.refresh();
    }});
  },
  copyList() {
    const text = app.getState().groceries.filter((item) => !item.checked).map((item) => `□ ${item.name}（${item.source.join("、")}）`).join("\n");
    if (!text) { wx.showToast({ title: "没有待采购食材", icon: "none" }); return; }
    wx.setClipboardData({ data: text });
  }
});
