const AI_PROVIDER_STORAGE_KEY = "lovemenu-ai-provider-v1";

function normalizeAiProvider(value = {}) {
  return {
    apiUrl: String(value.apiUrl || "").trim(),
    apiKey: String(value.apiKey || "").trim(),
    model: String(value.model || "").trim()
  };
}

function validateAiProvider(value) {
  const provider = normalizeAiProvider(value);
  const errors = {};
  if (!provider.apiUrl) errors.apiUrl = "请输入接口地址";
  else if (!/^https:\/\/[^\s]+$/i.test(provider.apiUrl)) errors.apiUrl = "请输入完整的 HTTPS 地址";
  if (!provider.model) errors.model = "请输入模型名称";
  if (!provider.apiKey) errors.apiKey = "请输入 API Key";
  return { provider, errors, valid: Object.keys(errors).length === 0 };
}

function getLocalAiProvider() {
  try {
    const stored = wx.getStorageSync(AI_PROVIDER_STORAGE_KEY);
    const result = validateAiProvider(stored);
    return result.valid ? result.provider : null;
  } catch (error) {
    return null;
  }
}

function saveLocalAiProvider(value) {
  const result = validateAiProvider(value);
  if (!result.valid) return result;
  wx.setStorageSync(AI_PROVIDER_STORAGE_KEY, result.provider);
  return result;
}

function clearLocalAiProvider() {
  wx.removeStorageSync(AI_PROVIDER_STORAGE_KEY);
}

module.exports = {
  AI_PROVIDER_STORAGE_KEY,
  clearLocalAiProvider,
  getLocalAiProvider,
  normalizeAiProvider,
  saveLocalAiProvider,
  validateAiProvider
};
