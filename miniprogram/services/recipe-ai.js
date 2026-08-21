const { normalizeGeneratedRecipe } = require("../utils/recipe-ai");
const { getLocalAiProvider } = require("../utils/ai-config");
const { classifyCloudError, cloudMessage } = require("../utils/cloud-error");

class RecipeAiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RecipeAiError";
    this.code = code;
  }
}

function errorMessage(code) {
  switch (code) {
    case "AI_NOT_CONFIGURED": return "AI 创建还没有配置，可以先手动新增";
    case "INVALID_PROMPT": return "请输入菜名，或描述你想做的菜";
    case "RATE_LIMITED": return "AI 有点忙，稍后再试一次";
    case "PROVIDER_FAILED": return "接口连接失败，请检查地址、模型和 API Key";
    case "INVALID_AI_RESPONSE": return "AI 没有生成完整菜谱，请换种说法再试";
    case "CLOUD_FUNCTION_MISSING": return cloudMessage(code, "ai");
    case "CLOUD_APPID_MISSING": return cloudMessage(code, "ai");
    case "CLOUD_ENV_INVALID": return cloudMessage(code, "ai");
    case "CLOUD_TIMEOUT": return cloudMessage(code, "ai");
    case "CLOUD_UNAVAILABLE": return "当前无法连接 AI，请检查网络后重试";
    default: return "暂时没有生成成功，请稍后重试";
  }
}

async function generateRecipe(prompt, inventory) {
  if (!wx.cloud || !wx.cloud.callFunction) {
    throw new RecipeAiError("CLOUD_UNAVAILABLE", errorMessage("CLOUD_UNAVAILABLE"));
  }

  let response;
  try {
    const providerConfig = getLocalAiProvider();
    response = await wx.cloud.callFunction({
      name: "recipe-ai",
      data: {
        prompt: String(prompt || "").trim(),
        inventory: (Array.isArray(inventory) ? inventory : []).slice(0, 40),
        ...(providerConfig ? { providerConfig } : {})
      }
    });
  } catch (error) {
    const code = classifyCloudError(error);
    throw new RecipeAiError(code, errorMessage(code));
  }

  const result = response && response.result;
  if (!result || !result.ok) {
    const code = result && result.code || "GENERATION_FAILED";
    throw new RecipeAiError(code, errorMessage(code));
  }

  const recipe = normalizeGeneratedRecipe(result.recipe);
  if (!recipe) throw new RecipeAiError("INVALID_AI_RESPONSE", errorMessage("INVALID_AI_RESPONSE"));
  return recipe;
}

async function checkAiConnection(providerConfig) {
  if (!wx.cloud || !wx.cloud.callFunction) {
    throw new RecipeAiError("CLOUD_UNAVAILABLE", errorMessage("CLOUD_UNAVAILABLE"));
  }
  let response;
  try {
    response = await wx.cloud.callFunction({
      name: "recipe-ai",
      data: { action: "check", providerConfig }
    });
  } catch (error) {
    const code = classifyCloudError(error);
    throw new RecipeAiError(code, errorMessage(code));
  }
  const result = response && response.result;
  if (!result || !result.ok) {
    const code = result && result.code || "GENERATION_FAILED";
    throw new RecipeAiError(code, errorMessage(code));
  }
  return result;
}

module.exports = { RecipeAiError, checkAiConnection, generateRecipe };
