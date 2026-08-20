const { GROCERY_GROUPS } = require("../../utils/constants");
const { inferGroceryCategory, inventoryItemForIngredient, movePurchasedToInventory, normalizeInventoryItem } = require("../../utils/domain");
const { selectTab } = require("../../utils/tab-bar");
const app = getApp();

const UNITS = ["个", "克", "斤", "毫升", "升", "勺", "根", "把", "片", "块", "颗", "瓶", "袋", "盒", "份"];
const FILTERS = [
  { value: "all", label: "全部" },
  { value: "enough", label: "充足" },
  { value: "low", label: "不多了" },
  { value: "out", label: "用完" }
];
const SORT_OPTIONS = [
  { value: "default", label: "默认排序" },
  { value: "low", label: "不多了优先" },
  { value: "recent", label: "最近添加" },
  { value: "name", label: "名称" },
  { value: "quantity", label: "数量" },
  { value: "expiry", label: "快过期优先" }
];
const TRACKING_FILTERS = [
  { value: "all", label: "全部记录" },
  { value: "status", label: "状态记录" },
  { value: "quantity", label: "数量记录" }
];
const LEVEL_COPY = {
  enough: "充足",
  low: "不多了",
  out: "用完"
};

function blankForm() {
  return { name: "", quantity: "", unit: "份", unitIndex: UNITS.indexOf("份"), category: "其他", categoryIndex: GROCERY_GROUPS.indexOf("其他"), level: "enough" };
}

function decoratedOptions(options, selected) {
  return options.map((option) => ({ ...option, active: option.value === selected }));
}

Page({
  data: {
    loading: true,
    query: "",
    filter: "all",
    filters: decoratedOptions(FILTERS, "all"),
    categoryFilter: "全部",
    categoryOptions: ["全部"].concat(GROCERY_GROUPS).map((label) => ({ label, active: label === "全部" })),
    trackingFilter: "all",
    trackingOptions: decoratedOptions(TRACKING_FILTERS, "all"),
    filterOpen: false,
    filterActive: false,
    sort: "default",
    sortLabel: "默认排序",
    items: [],
    summary: { total: 0, enough: 0, low: 0, out: 0 },
    adding: false,
    editingId: "",
    form: blankForm(),
    units: UNITS,
    categories: GROCERY_GROUPS
  },

  async onShow() {
    selectTab(this, 3);
    await app.ensureReady();
    this.refresh();
  },

  refresh() {
    const inventory = app.getState().inventory;
    const query = this.data.query.trim().toLowerCase();
    const priority = { low: 0, out: 1, enough: 2 };
    const items = inventory
      .filter((item) => {
        const statusMatches = this.data.filter === "all" || item.level === this.data.filter;
        const categoryMatches = this.data.categoryFilter === "全部" || item.category === this.data.categoryFilter;
        const trackingMatches = this.data.trackingFilter === "all"
          || (this.data.trackingFilter === "quantity" ? item.quantity !== null : item.quantity === null);
        return statusMatches && categoryMatches && trackingMatches && item.name.toLowerCase().includes(query);
      })
      .sort((left, right) => {
        if (this.data.sort === "low") return priority[left.level] - priority[right.level] || right.updatedAt - left.updatedAt;
        if (this.data.sort === "recent") return right.updatedAt - left.updatedAt;
        if (this.data.sort === "name") return left.name.localeCompare(right.name);
        if (this.data.sort === "quantity") return Number(right.quantity !== null) - Number(left.quantity !== null) || Number(right.quantity || 0) - Number(left.quantity || 0);
        if (this.data.sort === "expiry") return (left.expiresAt || "9999-12-31").localeCompare(right.expiresAt || "9999-12-31");
        return left.category.localeCompare(right.category) || right.updatedAt - left.updatedAt;
      })
      .map((item) => ({
        ...item,
        mark: item.name.slice(0, 1),
        levelLabel: LEVEL_COPY[item.level],
        tracked: item.quantity !== null,
        recordLabel: item.quantity === null ? "状态记录" : "数量记录"
      }));

    this.setData({
      loading: false,
      items,
      filterActive: this.data.categoryFilter !== "全部" || this.data.trackingFilter !== "all",
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
    this.setData({ filter, filters: decoratedOptions(FILTERS, filter) }, () => this.refresh());
  },

  toggleFilterPanel() { this.setData({ filterOpen: !this.data.filterOpen }); },

  selectCategoryFilter(event) {
    const value = event.currentTarget.dataset.value;
    this.setData({
      categoryFilter: value,
      categoryOptions: this.data.categoryOptions.map((item) => ({ ...item, active: item.label === value }))
    }, () => this.refresh());
  },

  selectTrackingFilter(event) {
    const value = event.currentTarget.dataset.value;
    this.setData({ trackingFilter: value, trackingOptions: decoratedOptions(TRACKING_FILTERS, value) }, () => this.refresh());
  },

  resetAdvancedFilter() {
    this.setData({
      categoryFilter: "全部",
      categoryOptions: this.data.categoryOptions.map((item) => ({ ...item, active: item.label === "全部" })),
      trackingFilter: "all",
      trackingOptions: decoratedOptions(TRACKING_FILTERS, "all")
    }, () => this.refresh());
  },

  openSort() {
    wx.showActionSheet({
      itemList: SORT_OPTIONS.map((item) => item.label),
      success: ({ tapIndex }) => {
        const option = SORT_OPTIONS[tapIndex];
        this.setData({ sort: option.value, sortLabel: option.label }, () => this.refresh());
      }
    });
  },

  openOverview() {
    const { total, enough, low, out } = this.data.summary;
    wx.showModal({ title: "库存总览", content: `共 ${total} 种食材\n充足 ${enough} 种 · 不多了 ${low} 种 · 用完 ${out} 种`, showCancel: false });
  },

  openAdd() { this.setData({ adding: true, editingId: "", form: blankForm() }); },

  openAddOptions() {
    wx.showActionSheet({
      itemList: ["手动添加", "从采购清单导入"],
      success: ({ tapIndex }) => tapIndex === 0 ? this.openAdd() : this.importFromGroceries()
    });
  },

  importFromGroceries() {
    const groceries = app.getState().groceries;
    if (!groceries.length) {
      wx.showToast({ title: "采购清单里还没有食材", icon: "none" });
      return;
    }
    const choices = groceries.slice(0, 6);
    wx.showActionSheet({
      itemList: choices.map((item) => `${item.name} · ${item.purchaseQuantity || item.quantity} ${item.purchaseUnit || item.unit}`),
      success: ({ tapIndex }) => {
        const grocery = choices[tapIndex];
        app.update((state) => movePurchasedToInventory(state, [grocery.id]));
        wx.showToast({ title: `已导入${grocery.name}`, icon: "success" });
        this.refresh();
      }
    });
  },

  cancelAdd() { this.setData({ adding: false, editingId: "", form: blankForm() }); },

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
      const existing = this.data.editingId
        ? state.inventory.find((item) => item.id === this.data.editingId)
        : inventoryItemForIngredient(state, name);
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
    this.setData({ adding: false, editingId: "", form: blankForm() });
    this.refresh();
    wx.showToast({ title: updated ? "库存已更新" : "已加入库存", icon: "success" });
  },

  openItemMenu(event) {
    const id = event.currentTarget.dataset.id;
    const item = app.getState().inventory.find((entry) => entry.id === id);
    if (!item) return;
    const actions = [];
    if (item.level !== "enough") actions.push({ label: "标为充足", run: () => this.setItemLevel(id, "enough") });
    if (item.level !== "low") actions.push({ label: "标为不多了", run: () => this.setItemLevel(id, "low") });
    if (item.level !== "out") actions.push({ label: "标为用完", run: () => this.setItemLevel(id, "out") });
    actions.push({ label: item.quantity === null ? "改为数量记录" : "改为状态记录", run: () => this.toggleTracking(id) });
    actions.push({ label: "编辑", run: () => this.openEdit(id) });
    actions.push({ label: "删除", run: () => this.removeItem(id) });
    wx.showActionSheet({ itemList: actions.map((action) => action.label), success: ({ tapIndex }) => actions[tapIndex].run() });
  },

  setItemLevel(id, level) {
    app.update((state) => {
      const item = state.inventory.find((entry) => entry.id === id);
      if (!item) return;
      const tracked = item.quantity !== null;
      item.level = level;
      if (tracked && level === "out") item.quantity = 0;
      if (tracked && level !== "out" && item.quantity === 0) item.quantity = 1;
      item.updatedAt = Date.now();
    });
    this.refresh();
  },

  toggleTracking(id) {
    app.update((state) => {
      const item = state.inventory.find((entry) => entry.id === id);
      if (!item) return;
      item.quantity = item.quantity === null ? (item.level === "out" ? 0 : 1) : null;
      item.updatedAt = Date.now();
    });
    this.refresh();
  },

  openEdit(id) {
    const item = app.getState().inventory.find((entry) => entry.id === id);
    if (!item) return;
    this.setData({
      adding: true,
      editingId: id,
      form: {
        name: item.name,
        quantity: item.quantity === null ? "" : item.quantity,
        unit: item.unit,
        unitIndex: Math.max(0, UNITS.indexOf(item.unit)),
        category: item.category,
        categoryIndex: Math.max(0, GROCERY_GROUPS.indexOf(item.category)),
        level: item.level
      }
    });
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

  removeItem(id) {
    const item = app.getState().inventory.find((entry) => entry.id === id);
    if (!item) return;
    wx.showModal({ title: `删除${item.name}`, content: "删除后，菜谱会把它视为需要购买。", confirmColor: "#d46245", success: (result) => {
      if (!result.confirm) return;
      app.update((state) => { state.inventory = state.inventory.filter((entry) => entry.id !== id); });
      this.refresh();
    }});
  }
});
