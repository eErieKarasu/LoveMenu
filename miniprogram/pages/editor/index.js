const { CATEGORIES } = require("../../utils/constants");
const { recipeById } = require("../../utils/domain");
const app = getApp();
const INGREDIENT_UNITS = ["个", "克", "斤", "毫升", "升", "勺", "根", "把", "片", "块", "颗", "瓶", "袋", "盒", "份"];
let ingredientIdSeed = 0;
let stepIdSeed = 0;

function blankIngredient() {
  ingredientIdSeed += 1;
  return {
    id: `ingredient-new-${Date.now()}-${ingredientIdSeed}`,
    name: "",
    quantity: 1,
    unit: INGREDIENT_UNITS[0],
    unitIndex: 0,
    inStock: false
  };
}

function blankStep() {
  stepIdSeed += 1;
  return {
    id: `step-new-${Date.now()}-${stepIdSeed}`,
    text: ""
  };
}

function blankForm() {
  return {
    name: "", categories: ["快手菜"], prep: 8, cook: 12, difficulty: "简单",
    ingredientItems: [blankIngredient()], steps: [blankStep()]
  };
}

Page({
  data: {
    id: "",
    dishCategories: CATEGORIES.filter((item) => item !== "全部").map((name) => ({ name, active: name === "快手菜" })),
    difficulties: ["简单", "普通", "进阶"],
    ingredientUnits: INGREDIENT_UNITS,
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
      difficulty: recipe.difficulty,
      ingredientItems: recipe.ingredientItems.length
        ? recipe.ingredientItems.map((item) => ({
          ...item,
          unitIndex: Math.max(0, INGREDIENT_UNITS.indexOf(item.unit))
        }))
        : [blankIngredient()],
      steps: recipe.steps.length ? recipe.steps.map((step) => ({ ...step })) : [blankStep()]
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
  updateIngredient(event) {
    const index = Number(event.currentTarget.dataset.index);
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.ingredientItems[${index}].${field}`]: event.detail.value });
  },
  changeIngredientUnit(event) {
    const index = Number(event.currentTarget.dataset.index);
    const unitIndex = Number(event.detail.value);
    this.setData({
      [`form.ingredientItems[${index}].unitIndex`]: unitIndex,
      [`form.ingredientItems[${index}].unit`]: INGREDIENT_UNITS[unitIndex]
    });
  },
  toggleIngredientStock(event) {
    const index = Number(event.currentTarget.dataset.index);
    const current = this.data.form.ingredientItems[index];
    this.setData({ [`form.ingredientItems[${index}].inStock`]: !current.inStock });
  },
  addIngredient() {
    this.setData({ "form.ingredientItems": this.data.form.ingredientItems.concat(blankIngredient()) });
  },
  removeIngredient(event) {
    const index = Number(event.currentTarget.dataset.index);
    const items = this.data.form.ingredientItems.filter((_, itemIndex) => itemIndex !== index);
    this.setData({ "form.ingredientItems": items.length ? items : [blankIngredient()] });
  },
  updateStep(event) {
    const index = Number(event.currentTarget.dataset.index);
    this.setData({ [`form.steps[${index}].text`]: event.detail.value });
  },
  addStep() {
    this.setData({ "form.steps": this.data.form.steps.concat(blankStep()) });
  },
  removeStep(event) {
    const index = Number(event.currentTarget.dataset.index);
    const steps = this.data.form.steps.filter((_, stepIndex) => stepIndex !== index);
    this.setData({ "form.steps": steps.length ? steps : [blankStep()] });
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
    const existingRecipe = this.data.id ? recipeById(app.getState(), this.data.id) : null;
    const name = form.name.trim();
    if (!name) { this.setData({ nameError: true }); wx.showToast({ title: "请先填写菜名", icon: "none" }); return; }
    const steps = form.steps
      .filter((step) => step.text.trim())
      .map((step) => {
        const normalized = { id: step.id, text: step.text.trim() };
        if (Number(step.duration) > 0) normalized.duration = Number(step.duration);
        return normalized;
      });
    const ingredientItems = form.ingredientItems
      .filter((item) => item.name.trim())
      .map((item) => ({
        id: item.id,
        name: item.name.trim(),
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        unit: item.unit,
        inStock: Boolean(item.inStock)
      }));
    const data = {
      name,
      categories: form.categories.length ? form.categories : ["快手菜"],
      prep: Number(form.prep), cook: Number(form.cook), time: Number(form.prep) + Number(form.cook),
      difficulty: form.difficulty,
      flavor: existingRecipe && existingRecipe.flavor ? existingRecipe.flavor : "家常",
      spice: existingRecipe && existingRecipe.spice ? existingRecipe.spice : "不辣",
      tags: existingRecipe && Array.isArray(existingRecipe.tags) ? existingRecipe.tags : [],
      ingredientItems,
      pantry: ingredientItems.filter((item) => item.inStock).map((item) => item.name),
      buy: ingredientItems.filter((item) => !item.inStock).map((item) => item.name),
      steps,
      ingredients: ingredientItems.map((item) => item.name),
      likes: existingRecipe && existingRecipe.likes ? existingRecipe.likes : { "我": "喜欢", "伴侣": "一般", "小朋友": "一般" },
      recent: existingRecipe && existingRecipe.recent ? existingRecipe.recent : "刚刚",
      favorite: existingRecipe ? Boolean(existingRecipe.favorite) : false
    };
    app.update((state) => {
      if (this.data.id) Object.assign(recipeById(state, this.data.id), data);
      else state.recipes.unshift({ id: `recipe-${Date.now()}`, ...data });
    });
    wx.showToast({ title: "菜谱已保存", icon: "success" });
    setTimeout(() => wx.navigateBack(), 500);
  }
});
