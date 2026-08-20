const { GROCERY_GROUPS } = require("../../utils/constants");
const { inferGroceryCategory, inventoryItemForIngredient, normalizeInventoryItem } = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

const UNITS = ["个", "克", "斤", "毫升", "升", "勺", "根", "把", "片", "块", "颗", "瓶", "袋", "盒", "份"];
const FILTERS = [
  { value: "all", label: "全部" },
  { value: "enough", label: "充足" },
  { value: "low", label: "不多了" },
  { value: "out", label: "用完" }
];
const LEVEL_COPY = {
  enough: { label: "充足", action: "标为不多了" },
  low: { label: "不多了", action: "标为用完" },
  out: { label: "已用完", action: "重新有货" }
};

function blankForm() {
  return { name: "", quantity: "", unit: "份", unitIndex: UNITS.indexOf("份"), category: "其他", categoryIndex: GROCERY_GROUPS.indexOf("其他"), level: "enough" };
}

Page({
  data: {
    loading: true,
    query: "",
    filter: "all",
    filters: FILTERS.map((item) => ({ ...item, active: item.value === "all" })),
    items: [],
    summary: { total: 0, enough: 0, low: 0, out: 0 },
    adding: false,
    form: blankForm(),
    units: UNITS,
    categories: GROCERY_GROUPS
  },
  async onShow() { selectTab(this, 3); await app.ensureReady(); this.refresh(); },
  refresh() {
    const inventory = app.getState().inventory;
    const query = this.data.query.trim().toLowerCase();
    const priority = { low: 0, out: 1, enough: 2 };
    const items = inventory
      .filter((item) => (this.data.filter === "all" || item.level === this.data.filter) && item.name.toLowerCase().includes(query))
      .sort((left, right) => priority[left.level] - priority[right.level] || left.category.localeCompare(right.category))
      .map((item) => ({
        ...item,
        mark: item.name.slice(0, 1),
        levelLabel: LEVEL_COPY[item.level].label,
        levelAction: LEVEL_COPY[item.level].action,
        quantityText: item.quantity === null ? "按状态记录" : `${item.quantity} ${item.unit}`,
        tracked: item.quantity !== null
      }));
    this.setData({
      loading: false,
      items,
      summary: {
        total: inventory.length,
        enough: inventory.filter((item) => item.level === "enough").length,
        low: inventory.filter((item) => item.level === "low").length,
        out: inventory.filter((item) => item.level === "out").length
      }
    });
  },
  onSearch(event) { this.setData({ query: event.detail.value }, () => this.refresh()); },
  selectFilter(event) {
    const filter = event.currentTarget.dataset.value;
    this.setData({ filter, filters: FILTERS.map((item) => ({ ...item, active: item.value === filter })) }, () => this.refresh());
  },
  openAdd() { this.setData({ adding: true, form: blankForm() }); },
  cancelAdd() { this.setData({ adding: false, form: blankForm() }); },
  updateForm(event) {
    const field = event.currentTarget.dataset.field;
    const updates = { [`form.${field}`]: event.detail.value };
    if (field === "name" && this.data.form.category === "其他") {
      const category = inferGroceryCategory(event.detail.value);
      updates["form.category"] = category;
      updates["form.categoryIndex"] = Math.max(0, GROCERY_GROUPS.indexOf(category));
    }
    this.setData(updates);
  },
  changeUnit(event) {
    const unitIndex = Number(event.detail.value);
    this.setData({ "form.unitIndex": unitIndex, "form.unit": UNITS[unitIndex] });
  },
  changeCategory(event) {
    const categoryIndex = Number(event.detail.value);
    this.setData({ "form.categoryIndex": categoryIndex, "form.category": GROCERY_GROUPS[categoryIndex] });
  },
  selectLevel(event) { this.setData({ "form.level": event.currentTarget.dataset.value }); },
  saveItem() {
    const form = this.data.form;
    const name = form.name.trim();
    if (!name) { wx.showToast({ title: "请先填写食材名称", icon: "none" }); return; }
    let updated = false;
    app.update((state) => {
      const existing = inventoryItemForIngredient(state, name);
      const quantity = form.quantity === "" ? null : Number(form.quantity);
      const data = normalizeInventoryItem({
        id: existing && existing.id || `inventory-${Date.now()}`,
        name,
        category: form.category,
        level: form.level,
        quantity,
        unit: form.unit,
        updatedAt: Date.now()
      });
      if (existing) { Object.assign(existing, data); updated = true; }
      else state.inventory.unshift(data);
    });
    this.setData({ adding: false, form: blankForm() });
    this.refresh();
    wx.showToast({ title: updated ? "库存已更新" : "已加入库存", icon: "success" });
  },
  cycleLevel(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => {
      const item = state.inventory.find((entry) => entry.id === id);
      if (!item) return;
      if (item.level === "enough") item.level = "low";
      else if (item.level === "low") { item.level = "out"; item.quantity = 0; }
      else { item.level = "enough"; item.quantity = null; }
      item.updatedAt = Date.now();
    });
    this.refresh();
  },
  adjustQuantity(event) {
    const id = event.currentTarget.dataset.id;
    const delta = Number(event.currentTarget.dataset.delta);
    app.update((state) => {
      const item = state.inventory.find((entry) => entry.id === id);
      if (!item) return;
      item.quantity = Math.max(0, (item.quantity === null ? 0 : item.quantity) + delta);
      item.level = item.quantity === 0 ? "out" : item.level === "out" ? "low" : item.level;
      item.updatedAt = Date.now();
    });
    this.refresh();
  },
  startTracking(event) {
    const id = event.currentTarget.dataset.id;
    app.update((state) => {
      const item = state.inventory.find((entry) => entry.id === id);
      if (!item) return;
      item.quantity = item.level === "out" ? 0 : 1;
      item.updatedAt = Date.now();
    });
    this.refresh();
  },
  removeItem(event) {
    const id = event.currentTarget.dataset.id;
    const item = app.getState().inventory.find((entry) => entry.id === id);
    if (!item) return;
    wx.showModal({ title: `移除${item.name}`, content: "移除后，菜谱会把它视为需要购买。", success: (result) => {
      if (!result.confirm) return;
      app.update((state) => { state.inventory = state.inventory.filter((entry) => entry.id !== id); });
      this.refresh();
    }});
  }
});
