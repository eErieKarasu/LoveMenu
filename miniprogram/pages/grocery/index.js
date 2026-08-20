const { GROCERY_GROUPS } = require("../../utils/constants");
const { movePurchasedToInventory } = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

const GROUP_ICONS = {
  "蔬菜": "/assets/icons/grocery-vegetable.svg",
  "肉蛋": "/assets/icons/grocery-protein.svg",
  "水产": "/assets/icons/grocery-seafood.svg",
  "调味品": "/assets/icons/grocery-seasoning.svg",
  "主食": "/assets/icons/grocery-staple.svg",
  "其他": "/assets/icons/grocery-other.svg"
};

Page({
  data: {
    loading: true,
    groups: [],
    collapsedGroups: {},
    totalCount: 0,
    purchasedCount: 0,
    remainingCount: 0,
    progressPercent: 0,
    progressStyle: "background: #ece5dd;",
    sourceCount: 0
  },
  async onShow() { selectTab(this, 2); await app.ensureReady(); this.refresh(); },
  refresh() {
    const groceries = app.getState().groceries;
    const groups = GROCERY_GROUPS.map((name) => ({
      name,
      iconSrc: GROUP_ICONS[name],
      collapsed: Boolean(this.data.collapsedGroups[name]),
      items: groceries.filter((item) => item.category === name).map((item) => ({
        ...item,
        quantityText: `${item.purchaseQuantity || item.quantity} ${item.purchaseUnit || item.unit}`,
        sourceText: item.source.join("、")
      }))
    })).filter((group) => group.items.length);
    const totalCount = groceries.length;
    const purchasedCount = groceries.filter((item) => item.checked).length;
    const remainingCount = totalCount - purchasedCount;
    const progressPercent = totalCount ? Math.round((purchasedCount / totalCount) * 100) : 0;
    const sourceKeys = new Set();
    groceries.forEach((item) => {
      if (item.sourceRecipeIds && item.sourceRecipeIds.length) item.sourceRecipeIds.forEach((id) => sourceKeys.add(`id:${id}`));
      else (item.source || []).forEach((name) => sourceKeys.add(`name:${name}`));
    });
    this.setData({
      loading: false,
      groups,
      totalCount,
      purchasedCount,
      remainingCount,
      progressPercent,
      progressStyle: `background: conic-gradient(#d46245 ${progressPercent}%, #ece5dd 0);`,
      sourceCount: sourceKeys.size
    });
  },
  toggleGroup(event) {
    const name = event.currentTarget.dataset.name;
    this.setData({ collapsedGroups: { ...this.data.collapsedGroups, [name]: !this.data.collapsedGroups[name] } }, () => this.refresh());
  },
  toggleItem(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => { const item = state.groceries.find((entry) => entry.id === id); if (item) item.checked = !item.checked; });
    this.refresh();
  },
  completePurchased() {
    const count = app.getState().groceries.filter((item) => item.checked).length;
    if (!count) { wx.showToast({ title: "还没有已购买项目", icon: "none" }); return; }
    app.update((state) => movePurchasedToInventory(state));
    wx.showToast({ title: `已入库 ${count} 项`, icon: "success" });
    this.refresh();
  },
  copyList() {
    const text = app.getState().groceries
      .filter((item) => !item.checked)
      .map((item) => `□ ${item.name} × ${item.purchaseQuantity || item.quantity} ${item.purchaseUnit || item.unit}（${item.source.join("、")}）`)
      .join("\n");
    if (!text) { wx.showToast({ title: "没有待采购食材", icon: "none" }); return; }
    wx.setClipboardData({ data: text });
  }
});
