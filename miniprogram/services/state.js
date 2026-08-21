const STORAGE_KEY = "lovemenu-state-v5";
const LEGACY_STORAGE_KEYS = ["lovemenu-state-v4", "lovemenu-state-v3", "lovemenu-state-v2"];
const { classifyCloudError, cloudMessage } = require("../utils/cloud-error");

class StateCloudError extends Error {
  constructor(code) {
    super(cloudMessage(code, "state"));
    this.name = "StateCloudError";
    this.code = code;
  }
}

function supportedState(state) {
  return Boolean(state && (state.version === 3 || state.version === 4 || state.version === 5));
}

function cloudAvailable() {
  return Boolean(wx.cloud && wx.cloud.callFunction);
}

function readLocal(fallback) {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (supportedState(stored)) return stored;
    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = wx.getStorageSync(key);
      if (supportedState(legacy)) return legacy;
    }
    return fallback;
  } catch (error) {
    return fallback;
  }
}

function writeLocal(state) {
  wx.setStorageSync(STORAGE_KEY, state);
}

async function loadState(fallback) {
  const local = readLocal(fallback);
  if (!cloudAvailable()) return { state: local, source: "local" };
  try {
    const response = await wx.cloud.callFunction({ name: "state", data: { action: "load" } });
    if (response.result && response.result.ok && supportedState(response.result.state)) {
      if (response.result.state.version === 5) writeLocal(response.result.state);
      return { state: response.result.state, source: "cloud" };
    }
    return { state: local, source: "local" };
  } catch (error) {
    const code = classifyCloudError(error);
    return { state: local, source: "local", error: new StateCloudError(code) };
  }
}

async function saveState(state) {
  writeLocal(state);
  if (!cloudAvailable()) return { source: "local" };
  let response;
  try {
    response = await wx.cloud.callFunction({ name: "state", data: { action: "save", state } });
  } catch (error) {
    throw new StateCloudError(classifyCloudError(error));
  }
  if (!response.result || !response.result.ok) {
    throw new Error((response.result && response.result.message) || "云端保存失败");
  }
  return { source: "cloud" };
}

module.exports = { loadState, saveState, StateCloudError, STORAGE_KEY, LEGACY_STORAGE_KEYS };
