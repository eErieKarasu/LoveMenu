const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeAiProvider, validateAiProvider } = require("../miniprogram/utils/ai-config");

test("AI 个人配置会清理首尾空格", () => {
  assert.deepEqual(normalizeAiProvider({
    apiUrl: " https://api.example.com/v1/chat/completions ",
    apiKey: " secret-key ",
    model: " model-name "
  }), {
    apiUrl: "https://api.example.com/v1/chat/completions",
    apiKey: "secret-key",
    model: "model-name"
  });
});

test("AI 个人配置必须完整且使用 HTTPS", () => {
  const invalid = validateAiProvider({ apiUrl: "http://api.example.com", apiKey: "", model: "" });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.apiUrl, "请输入完整的 HTTPS 地址");
  assert.equal(invalid.errors.apiKey, "请输入 API Key");
  assert.equal(invalid.errors.model, "请输入模型名称");
  assert.equal(validateAiProvider({
    apiUrl: "https://api.example.com/v1/chat/completions",
    apiKey: "secret-key",
    model: "model-name"
  }).valid, true);
});
