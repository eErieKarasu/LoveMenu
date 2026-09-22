const { generateRecipe } = require("../../services/recipe-ai");
const { AI_DRAFT_STORAGE_KEY, shouldIncludeInventory } = require("../../utils/recipe-ai");
const { prepareRecipeImage } = require("../../utils/recipe-image");
const app = getApp();

function suggestionsForInventory(count) {
  return [
    {
      prompt: "用家里现有的食材做一道菜",
      title: "用家里现有的食材做一道菜",
      subtitle: count ? `当前库存有 ${count} 种食材` : "当前库存还没有食材"
    },
    { prompt: "20 分钟内做一道下饭菜", title: "20 分钟内做一道下饭菜", subtitle: "" },
    { prompt: "帮我想一道今晚的晚餐", title: "帮我想一道今晚的晚餐", subtitle: "" }
  ];
}

Page({
  data: {
    prompt: "",
    promptLength: 0,
    generating: false,
    imageBusy: false,
    imagePreview: "",
    errorMessage: "",
    inventoryCount: 0,
    suggestions: suggestionsForInventory(0)
  },
  async onLoad() {
    await app.ensureReady();
    this.refreshInventorySuggestions();
  },
  refreshInventorySuggestions() {
    const inventory = app.getState().inventory
      .filter((item) => item.level !== "out" && String(item.name || "").trim())
      .map((item) => String(item.name).trim());
    this.inventoryNames = Array.from(new Set(inventory));
    this.setData({
      inventoryCount: this.inventoryNames.length,
      suggestions: suggestionsForInventory(this.inventoryNames.length)
    });
  },
  updatePrompt(event) {
    const prompt = event.detail.value;
    this.setData({ prompt, promptLength: prompt.length, errorMessage: "" });
  },
  useSuggestion(event) {
    const prompt = event.currentTarget.dataset.value;
    this.setData({ prompt, promptLength: prompt.length, errorMessage: "" });
  },
  chooseAiImage() {
    if (this.data.generating || this.data.imageBusy) return;
    wx.showActionSheet({
      itemList: ["从相册选择", "拍照"],
      success: ({ tapIndex }) => this.pickAiImage(tapIndex === 0 ? "album" : "camera")
    });
  },
  pickAiImage(sourceType) {
    const handle = (file) => this.prepareAiImage(file || {});
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: [sourceType],
        sizeType: ["compressed"],
        success: ({ tempFiles }) => handle(tempFiles[0])
      });
      return;
    }
    wx.chooseImage({
      count: 1,
      sourceType: [sourceType],
      sizeType: ["compressed"],
      success: ({ tempFilePaths, tempFiles }) => handle((tempFiles && tempFiles[0]) || { tempFilePath: tempFilePaths[0] })
    });
  },
  async prepareAiImage(file) {
    this.setData({ imageBusy: true, errorMessage: "" });
    try {
      const preparedPath = await prepareRecipeImage(file || {});
      this.setData({ imageBusy: false, imagePreview: preparedPath });
    } catch (error) {
      this.setData({ imageBusy: false, imagePreview: "", errorMessage: error.message || "图片处理失败，请重试" });
    }
  },
  removeAiImage() {
    if (this.data.generating) return;
    this.setData({ imagePreview: "", errorMessage: "" });
  },
  async generate() {
    if (this.data.generating || this.data.imageBusy) return;
    const prompt = this.data.prompt.trim();
    if (!prompt) {
      this.setData({ errorMessage: "请输入菜名，或描述你想做的菜" });
      return;
    }

    this.setData({ generating: true, errorMessage: "" });
    try {
      const inventory = shouldIncludeInventory(prompt) ? this.inventoryNames || [] : [];
      const recipe = await generateRecipe(prompt, inventory);
      wx.setStorageSync(AI_DRAFT_STORAGE_KEY, {
        prompt,
        recipe,
        imagePreview: this.data.imagePreview || "",
        createdAt: Date.now()
      });
      wx.navigateTo({
        url: "/pages/editor/index?source=ai",
        fail: () => this.setData({ generating: false, errorMessage: "无法打开确认页，请重试" })
      });
    } catch (error) {
      this.setData({ generating: false, errorMessage: error.message || "暂时没有生成成功，请稍后重试" });
    }
  },
  async onShow() {
    await app.ensureReady();
    this.refreshInventorySuggestions();
    if (this.data.generating) this.setData({ generating: false });
  }
});
