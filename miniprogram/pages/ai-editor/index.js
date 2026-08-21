const { generateRecipe } = require("../../services/recipe-ai");
const { AI_DRAFT_STORAGE_KEY } = require("../../utils/recipe-ai");
const app = getApp();

Page({
  data: {
    prompt: "",
    promptLength: 0,
    generating: false,
    errorMessage: "",
    suggestions: [
      "20 分钟内做好的番茄鸡蛋下饭菜",
      "用家里常见食材做一道清淡晚餐",
      "不辣、小朋友也喜欢的鸡肉菜"
    ]
  },
  async onLoad() {
    await app.ensureReady();
  },
  updatePrompt(event) {
    const prompt = event.detail.value;
    this.setData({ prompt, promptLength: prompt.length, errorMessage: "" });
  },
  useSuggestion(event) {
    const prompt = event.currentTarget.dataset.value;
    this.setData({ prompt, promptLength: prompt.length, errorMessage: "" });
  },
  cancel() { wx.navigateBack(); },
  async generate() {
    if (this.data.generating) return;
    const prompt = this.data.prompt.trim();
    if (prompt.length < 4) {
      this.setData({ errorMessage: "请描述口味、食材或用餐需求" });
      return;
    }

    this.setData({ generating: true, errorMessage: "" });
    try {
      const state = app.getState();
      const inventory = state.inventory
        .filter((item) => item.level !== "out")
        .map((item) => item.name)
        .filter(Boolean);
      const recipe = await generateRecipe(prompt, inventory);
      wx.setStorageSync(AI_DRAFT_STORAGE_KEY, { prompt, recipe, createdAt: Date.now() });
      wx.navigateTo({
        url: "/pages/editor/index?source=ai",
        fail: () => this.setData({ generating: false, errorMessage: "无法打开确认页，请重试" })
      });
    } catch (error) {
      this.setData({ generating: false, errorMessage: error.message || "暂时没有生成成功，请稍后重试" });
    }
  },
  onShow() {
    if (this.data.generating) this.setData({ generating: false });
  }
});
