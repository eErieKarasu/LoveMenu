const STORAGE_KEY = "lovemenu-state-v5";
const LEGACY_STORAGE_KEYS = ["lovemenu-state-v4", "lovemenu-state-v3", "lovemenu-state-v2"];

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
    return { state: local, source: "local", error };
  }
}

async function saveState(state) {
  writeLocal(state);
  if (!cloudAvailable()) return { source: "local" };
  const response = await wx.cloud.callFunction({ name: "state", data: { action: "save", state } });
  if (!response.result || !response.result.ok) {
    throw new Error((response.result && response.result.message) || "云端保存失败");
  }
  return { source: "cloud" };
}

module.exports = { loadState, saveState, STORAGE_KEY, LEGACY_STORAGE_KEYS };
