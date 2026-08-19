const { CATEGORIES } = require("../../utils/constants");
const { recipeById } = require("../../utils/domain");
const app = getApp();

function blankForm() {
  return {
    name: "", categories: ["快手菜"], prep: 8, cook: 12, difficulty: "简单",
    flavor: "家常", spice: "不辣", tagsText: "", pantryText: "", buyText: "", stepsText: ""
  };
}

function splitText(value) {
  return value.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean);
}

Page({
  data: {
    id: "",
    dishCategories: CATEGORIES.filter((item) => item !== "全部").map((name) => ({ name, active: name === "快手菜" })),
    difficulties: ["简单", "普通", "进阶"],
    form: blankForm(),
    nameError: false
  },
  onLoad(options) { this.setData({ id: options.id || "" }); },
  async onReady() {
    await app.ensureReady();
    if (!this.data.id) return;
    const recipe = recipeById(app.getState(), this.data.id);
    if (!recipe) return;
    const form = {
      name: recipe.name, categories: recipe.categories.slice(), prep: recipe.prep, cook: recipe.cook,
      difficulty: recipe.difficulty, flavor: recipe.flavor, spice: recipe.spice,
      tagsText: recipe.tags.join("、"), pantryText: recipe.pantry.join("、"),
      buyText: recipe.buy.join("、"), stepsText: recipe.steps.join("\n")
    };
    this.setData({ form, dishCategories: this.data.dishCategories.map((item) => ({ ...item, active: form.categories.includes(item.name) })) });
  },
  updateField(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value, nameError: field === "name" ? false : this.data.nameError });
  },
  adjustTime(event) {
    const field = event.currentTarget.dataset.field;
    const delta = Number(event.currentTarget.dataset.delta);
    this.setData({ [`form.${field}`]: Math.max(1, Math.min(180, Number(this.data.form[field]) + delta)) });
  },
  toggleCategory(event) {
    const value = event.currentTarget.dataset.value;
    const selected = this.data.form.categories.includes(value)
      ? this.data.form.categories.filter((item) => item !== value)
      : this.data.form.categories.concat(value);
    this.setData({
      "form.categories": selected,
      dishCategories: this.data.dishCategories.map((item) => ({ ...item, active: selected.includes(item.name) }))
    });
  },
  setDifficulty(event) { this.setData({ "form.difficulty": event.currentTarget.dataset.value }); },
  cancel() { wx.navigateBack(); },
  save() {
    const form = this.data.form;
    const name = form.name.trim();
    if (!name) { this.setData({ nameError: true }); wx.showToast({ title: "请先填写菜名", icon: "none" }); return; }
    const steps = form.stepsText.split(/\n/).map((item) => item.trim()).filter(Boolean);
    const data = {
      name,
      categories: form.categories.length ? form.categories : ["快手菜"],
      prep: Number(form.prep), cook: Number(form.cook), time: Number(form.prep) + Number(form.cook),
      difficulty: form.difficulty, flavor: form.flavor.trim() || "家常", spice: form.spice.trim() || "不辣",
      tags: splitText(form.tagsText), pantry: splitText(form.pantryText), buy: splitText(form.buyText),
      steps: steps.length ? steps : ["处理主要食材。", "热锅后按顺序下锅并调味。", "试味后出锅。"],
      ingredients: Array.from(new Set(splitText(form.pantryText).concat(splitText(form.buyText)))),
      likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "一般" }, recent: "刚刚", favorite: false
    };
    app.update((state) => {
      if (this.data.id) Object.assign(recipeById(state, this.data.id), data);
      else state.recipes.unshift({ id: `recipe-${Date.now()}`, ...data });
    });
    wx.showToast({ title: "菜谱已保存", icon: "success" });
    setTimeout(() => wx.navigateBack(), 500);
  }
});
