const test = require("node:test");
const assert = require("node:assert/strict");
const { classifyCloudError, cloudMessage } = require("../miniprogram/utils/cloud-error");

test("云调用错误会区分函数缺失与 AppID 异常", () => {
  assert.equal(classifyCloudError({ errMsg: "ResourceNotFound.Function" }), "CLOUD_FUNCTION_MISSING");
  assert.equal(classifyCloudError({ errMsg: "cloud.callFunction:fail Error: appid missing" }), "CLOUD_APPID_MISSING");
  assert.equal(classifyCloudError({ errCode: -504003, errMsg: "Invoking task timed out after 3 seconds" }), "CLOUD_TIMEOUT");
  assert.equal(classifyCloudError({ errMsg: "network timeout" }), "CLOUD_UNAVAILABLE");
});

test("云错误提示会针对 AI 与数据同步给出可操作信息", () => {
  assert.equal(cloudMessage("CLOUD_FUNCTION_MISSING", "ai"), "AI 云函数尚未部署，请先部署 recipe-ai");
  assert.equal(cloudMessage("CLOUD_FUNCTION_MISSING", "state"), "数据云函数尚未部署，请先部署 state");
  assert.equal(cloudMessage("CLOUD_APPID_MISSING", "state"), "小程序 AppID 未正确关联云环境");
  assert.equal(cloudMessage("CLOUD_TIMEOUT", "ai"), "AI 生成超时，请稍后重试");
});
