const STORAGE_KEY = "lovemenu-state-v2";

function cloudAvailable() {
  return Boolean(wx.cloud && wx.cloud.callFunction);
}

function readLocal(fallback) {
  try {
    return wx.getStorageSync(STORAGE_KEY) || fallback;
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
    if (response.result && response.result.ok && response.result.state) {
      writeLocal(response.result.state);
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

module.exports = { loadState, saveState, STORAGE_KEY };
