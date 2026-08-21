const { checkAiConnection } = require("../../services/recipe-ai");
const {
  clearLocalAiProvider,
  getLocalAiProvider,
  saveLocalAiProvider,
  validateAiProvider
} = require("../../utils/ai-config");

Page({
  data: {
    apiUrl: "",
    apiKey: "",
    model: "",
    showApiKey: false,
    hasSavedConfig: false,
    testing: false,
    savedMessage: "",
    errorMessage: "",
    apiUrlError: "",
    apiKeyError: "",
    modelError: ""
  },

  onLoad() {
    const provider = getLocalAiProvider();
    if (!provider) return;
    this.setData({ ...provider, hasSavedConfig: true });
  },

  updateApiUrl(event) {
    this.setData({ apiUrl: event.detail.value, apiUrlError: "", errorMessage: "", savedMessage: "" });
  },

  updateModel(event) {
    this.setData({ model: event.detail.value, modelError: "", errorMessage: "", savedMessage: "" });
  },

  updateApiKey(event) {
    this.setData({ apiKey: event.detail.value, apiKeyError: "", errorMessage: "", savedMessage: "" });
  },

  toggleApiKey() {
    this.setData({ showApiKey: !this.data.showApiKey });
  },

  validateForm() {
    const result = validateAiProvider(this.data);
    this.setData({
      apiUrlError: result.errors.apiUrl || "",
      apiKeyError: result.errors.apiKey || "",
      modelError: result.errors.model || ""
    });
    return result;
  },

  saveConfig() {
    const result = this.validateForm();
    if (!result.valid) {
      this.setData({ savedMessage: "", errorMessage: "请先补全正确的 AI 配置" });
      return;
    }
    saveLocalAiProvider(result.provider);
    this.setData({
      ...result.provider,
      hasSavedConfig: true,
      errorMessage: "",
      savedMessage: "已保存在当前设备，生成菜谱时会优先使用"
    });
    wx.showToast({ title: "配置已保存", icon: "success" });
  },

  async testConnection() {
    if (this.data.testing) return;
    const result = this.validateForm();
    if (!result.valid) {
      this.setData({ savedMessage: "", errorMessage: "请先补全正确的 AI 配置" });
      return;
    }
    this.setData({ testing: true, savedMessage: "", errorMessage: "" });
    try {
      await checkAiConnection(result.provider);
      this.setData({ testing: false, savedMessage: `连接成功，模型 ${result.provider.model} 可以响应` });
    } catch (error) {
      this.setData({ testing: false, errorMessage: error.message || "连接测试失败，请检查配置" });
    }
  },

  clearConfig() {
    wx.showModal({
      title: "清除个人配置？",
      content: "清除后，AI 创建会重新使用云函数中的默认配置。",
      confirmText: "清除",
      confirmColor: "#b94e36",
      success: ({ confirm }) => {
        if (!confirm) return;
        clearLocalAiProvider();
        this.setData({
          apiUrl: "",
          apiKey: "",
          model: "",
          showApiKey: false,
          hasSavedConfig: false,
          errorMessage: "",
          savedMessage: "已恢复使用云端默认配置",
          apiUrlError: "",
          apiKeyError: "",
          modelError: ""
        });
      }
    });
  }
});
