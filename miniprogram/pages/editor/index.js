const { CATEGORIES } = require("../../utils/constants");
const { recipeById } = require("../../utils/domain");
const { AI_DRAFT_STORAGE_KEY, INGREDIENT_UNITS, normalizeGeneratedRecipe } = require("../../utils/recipe-ai");
const { generateRecipeSteps } = require("../../services/recipe-ai");
const { prepareRecipeImage } = require("../../utils/recipe-image");
const app = getApp();
let ingredientIdSeed = 0;
let stepIdSeed = 0;

function blankIngredient() {
  ingredientIdSeed += 1;
  return {
    id: `ingredient-new-${Date.now()}-${ingredientIdSeed}`,
    name: "",
    quantity: 1,
    unit: INGREDIENT_UNITS[0],
    unitIndex: 0
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
    image: "", imagePreview: "", pendingImagePath: "",
    ingredientItems: [blankIngredient()], steps: [blankStep()]
  };
}

function explicitImageExtension(filePath) {
  const match = String(filePath || "").toLowerCase().match(/\.(jpe?g|png)(?:\?|$)/);
  return match ? (match[1] === "jpeg" ? "jpg" : match[1]) : "";
}

function imageExtension(filePath) {
  return explicitImageExtension(filePath) || "jpg";
}

function saveLocalFile(tempFilePath) {
  return new Promise((resolve, reject) => {
    wx.saveFile({
      tempFilePath,
      success: ({ savedFilePath }) => resolve(savedFilePath),
      fail: reject
    });
  });
}

Page({
  data: {
    id: "",
    source: "",
    dishCategories: CATEGORIES.filter((item) => item !== "全部").map((name) => ({ name, active: name === "快手菜" })),
    difficulties: ["简单", "普通", "进阶"],
    ingredientUnits: INGREDIENT_UNITS,
    form: blankForm(),
    aiMeta: { flavor: "家常", spice: "不辣", tags: [] },
    nameError: false,
    saving: false,
    imageBusy: false,
    generatingSteps: false,
    stepGenerationMessage: ""
  },
  onLoad(options) { this.setData({ id: options.id || "", source: options.source || "" }); },
  async onReady() {
    await app.ensureReady();
    if (this.data.source === "ai" && !this.data.id) {
      this.loadAiDraft();
      return;
    }
    if (!this.data.id) return;
    const recipe = recipeById(app.getState(), this.data.id);
    if (!recipe) return;
    const form = {
      name: recipe.name, categories: recipe.categories.slice(), prep: recipe.prep, cook: recipe.cook,
      difficulty: recipe.difficulty,
      image: recipe.image || "",
      imagePreview: recipe.image || "",
      pendingImagePath: "",
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
  loadAiDraft() {
    const stored = wx.getStorageSync(AI_DRAFT_STORAGE_KEY);
    const recipe = normalizeGeneratedRecipe(stored && stored.recipe);
    if (!recipe) {
      wx.showToast({ title: "AI 初稿已失效，请重新生成", icon: "none" });
      setTimeout(() => wx.navigateBack(), 500);
      return;
    }
    const draftImage = String(stored && stored.imagePreview || "");
    const form = {
      name: recipe.name,
      categories: recipe.categories.slice(),
      prep: recipe.prep,
      cook: recipe.cook,
      difficulty: recipe.difficulty,
      image: "",
      imagePreview: draftImage,
      pendingImagePath: draftImage,
      ingredientItems: recipe.ingredientItems.map((item) => ({
        id: blankIngredient().id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitIndex: Math.max(0, INGREDIENT_UNITS.indexOf(item.unit))
      })),
      steps: recipe.steps.map((step) => ({ id: blankStep().id, text: step.text }))
    };
    this.setData({
      form,
      aiMeta: { flavor: recipe.flavor, spice: recipe.spice, tags: recipe.tags.slice() },
      dishCategories: this.data.dishCategories.map((item) => ({ ...item, active: form.categories.includes(item.name) }))
    });
  },
  updateField(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value, nameError: field === "name" ? false : this.data.nameError });
  },
  chooseDishImage() {
    wx.showActionSheet({
      itemList: ["从相册选择", "拍照"],
      success: ({ tapIndex }) => this.pickDishImage(tapIndex === 0 ? "album" : "camera")
    });
  },
  pickDishImage(sourceType) {
    const handleImage = async (file) => {
      this.setData({ imageBusy: true });
      try {
        const preparedPath = await prepareRecipeImage(file || {});
        this.setData({
          imageBusy: false,
          "form.imagePreview": preparedPath,
          "form.pendingImagePath": preparedPath
        });
      } catch (error) {
        this.setData({ imageBusy: false });
        wx.showToast({ title: error.message || "图片处理失败，请重试", icon: "none" });
      }
    };

    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: [sourceType],
        sizeType: ["compressed"],
        success: ({ tempFiles }) => handleImage(tempFiles[0] || {})
      });
      return;
    }

    wx.chooseImage({
      count: 1,
      sourceType: [sourceType],
      sizeType: ["compressed"],
      success: ({ tempFilePaths, tempFiles }) => handleImage((tempFiles && tempFiles[0]) || { tempFilePath: tempFilePaths[0] })
    });
  },
  removeDishImage() {
    this.setData({
      "form.image": "",
      "form.imagePreview": "",
      "form.pendingImagePath": ""
    });
  },
  async persistDishImage() {
    const tempFilePath = this.data.form.pendingImagePath;
    if (!tempFilePath) return this.data.form.image || "";

    if (app.globalData.cloudEnabled && wx.cloud && wx.cloud.uploadFile) {
      try {
        const result = await wx.cloud.uploadFile({
          cloudPath: `recipe-images/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${imageExtension(tempFilePath)}`,
          filePath: tempFilePath
        });
        if (result.fileID) return result.fileID;
      } catch (error) {
        // Cloud is optional. Keep a persistent local copy when the upload is unavailable.
      }
    }

    return saveLocalFile(tempFilePath);
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
  generateSteps() {
    if (this.data.generatingSteps || this.data.saving) return;
    const hasSteps = this.data.form.steps.some((step) => String(step.text || "").trim());
    if (!hasSteps) {
      this.requestGeneratedSteps();
      return;
    }
    wx.showModal({
      title: "替换当前做法？",
      content: "AI 会根据现在的食材重新生成步骤，当前做法将被替换。",
      confirmText: "继续生成",
      success: ({ confirm }) => { if (confirm) this.requestGeneratedSteps(); }
    });
  },
  async requestGeneratedSteps() {
    const ingredientItems = this.data.form.ingredientItems
      .filter((item) => String(item.name || "").trim())
      .map((item) => ({
        name: String(item.name).trim(),
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        unit: item.unit
      }));
    if (!ingredientItems.length) {
      this.setData({ stepGenerationMessage: "请先填写至少一种食材" });
      return;
    }
    this.setData({ generatingSteps: true, stepGenerationMessage: "" });
    try {
      const steps = await generateRecipeSteps({
        name: this.data.form.name,
        prep: this.data.form.prep,
        cook: this.data.form.cook,
        difficulty: this.data.form.difficulty,
        ingredientItems
      });
      this.setData({
        generatingSteps: false,
        stepGenerationMessage: "已根据当前食材生成，还可以继续修改。",
        "form.steps": steps.map((step) => ({ id: blankStep().id, text: step.text }))
      });
    } catch (error) {
      this.setData({
        generatingSteps: false,
        stepGenerationMessage: error.message || "做法生成失败，请稍后重试"
      });
    }
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
  cancel() {
    if (this.data.source === "ai") wx.removeStorageSync(AI_DRAFT_STORAGE_KEY);
    wx.navigateBack();
  },
  async save() {
    if (this.data.saving || this.data.generatingSteps || this.data.imageBusy) return;
    const form = this.data.form;
    const existingRecipe = this.data.id ? recipeById(app.getState(), this.data.id) : null;
    const name = form.name.trim();
    if (!name) { this.setData({ nameError: true }); wx.showToast({ title: "请先填写菜名", icon: "none" }); return; }
    this.setData({ saving: true });
    let image;
    try {
      image = await this.persistDishImage();
    } catch (error) {
      this.setData({ saving: false });
      wx.showToast({ title: "图片保存失败，请重试", icon: "none" });
      return;
    }
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
        unit: item.unit
      }));
    const data = {
      name,
      image,
      categories: form.categories.length ? form.categories : ["快手菜"],
      prep: Number(form.prep), cook: Number(form.cook), time: Number(form.prep) + Number(form.cook),
      difficulty: form.difficulty,
      flavor: existingRecipe && existingRecipe.flavor ? existingRecipe.flavor : this.data.aiMeta.flavor,
      spice: existingRecipe && existingRecipe.spice ? existingRecipe.spice : this.data.aiMeta.spice,
      tags: existingRecipe && Array.isArray(existingRecipe.tags) ? existingRecipe.tags : this.data.aiMeta.tags,
      ingredientItems,
      steps,
      ingredients: ingredientItems.map((item) => item.name),
      recent: existingRecipe && existingRecipe.recent ? existingRecipe.recent : "刚刚",
      favorite: existingRecipe ? Boolean(existingRecipe.favorite) : false
    };
    app.update((state) => {
      if (this.data.id) Object.assign(recipeById(state, this.data.id), data);
      else state.recipes.unshift({ id: `recipe-${Date.now()}`, ...data });
    });
    if (this.data.source === "ai") wx.removeStorageSync(AI_DRAFT_STORAGE_KEY);
    wx.showToast({ title: "菜谱已保存", icon: "success" });
    setTimeout(() => {
      if (this.data.source === "ai") {
        wx.switchTab({ url: "/pages/recipes/index" });
        return;
      }
      wx.navigateBack();
    }, 500);
    this.setData({ saving: false });
  },
  onUnload() {
    if (this.data.source === "ai") wx.removeStorageSync(AI_DRAFT_STORAGE_KEY);
  }
});
