function cloudErrorText(error) {
  return [error && error.errCode, error && error.code, error && error.errMsg, error && error.message]
    .filter(Boolean)
    .join(" ");
}

function classifyCloudError(error) {
  const text = cloudErrorText(error);
  if (/-504003|FUNCTIONS_TIME_LIMIT_EXCEEDED|Invoking task timed out|function.*timed?\s*out/i.test(text)) {
    return "CLOUD_TIMEOUT";
  }
  if (/ResourceNotFound\.Function|FUNCTION_NOT_FOUND|function.*(?:not exist|not found)|云函数.*不存在/i.test(text)) {
    return "CLOUD_FUNCTION_MISSING";
  }
  if (/appid missing|41002/i.test(text)) return "CLOUD_APPID_MISSING";
  if (/INVALID_ENV|ENV_NOT_FOUND|environment.*(?:not exist|not found)|云环境.*不存在/i.test(text)) {
    return "CLOUD_ENV_INVALID";
  }
  return "CLOUD_UNAVAILABLE";
}

function cloudMessage(code, feature) {
  const isAi = feature === "ai";
  switch (code) {
    case "CLOUD_TIMEOUT":
      return isAi ? "AI 生成超时，请稍后重试" : "云同步超时，已保存在本机";
    case "CLOUD_FUNCTION_MISSING":
      return isAi ? "AI 云函数尚未部署，请先部署 recipe-ai" : "数据云函数尚未部署，请先部署 state";
    case "CLOUD_APPID_MISSING":
      return "小程序 AppID 未正确关联云环境";
    case "CLOUD_ENV_INVALID":
      return "云环境配置无效，请检查环境 ID";
    default:
      return isAi ? "当前无法连接 AI，请检查网络后重试" : "云同步失败，已保存在本机";
  }
}

module.exports = { classifyCloudError, cloudErrorText, cloudMessage };
