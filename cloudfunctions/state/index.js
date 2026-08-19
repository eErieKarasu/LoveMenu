const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const collection = db.collection("app_states");
const MAX_PAYLOAD_BYTES = 900000;

function validState(value) {
  return Boolean(
    value && value.version === 2 &&
    Array.isArray(value.recipes) &&
    Array.isArray(value.groceries) &&
    Array.isArray(value.selectedToday) &&
    Array.isArray(value.weekPlan) && value.weekPlan.length === 7
  );
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  if (!OPENID) return { ok: false, code: "UNAUTHORIZED", message: "无法识别当前微信用户" };

  if (event.action === "load") {
    try {
      const result = await collection.doc(OPENID).get();
      return { ok: true, state: result.data.state, updatedAt: result.data.updatedAt };
    } catch (error) {
      if (error.errCode === -1 || /not exist|not found/i.test(error.errMsg || error.message || "")) {
        return { ok: true, state: null };
      }
      console.error(JSON.stringify({ level: "error", event: "state.load", openidSuffix: OPENID.slice(-6), message: error.message }));
      return { ok: false, code: "LOAD_FAILED", message: "暂时无法读取家庭菜单" };
    }
  }

  if (event.action === "save") {
    if (!validState(event.state)) return { ok: false, code: "INVALID_STATE", message: "菜单数据格式不正确" };
    if (Buffer.byteLength(JSON.stringify(event.state), "utf8") > MAX_PAYLOAD_BYTES) {
      return { ok: false, code: "PAYLOAD_TOO_LARGE", message: "菜单数据过大" };
    }
    try {
      await collection.doc(OPENID).set({ data: { ownerId: OPENID, state: event.state, updatedAt: db.serverDate() } });
      return { ok: true };
    } catch (error) {
      console.error(JSON.stringify({ level: "error", event: "state.save", openidSuffix: OPENID.slice(-6), message: error.message }));
      return { ok: false, code: "SAVE_FAILED", message: "暂时无法保存家庭菜单" };
    }
  }

  return { ok: false, code: "INVALID_ACTION", message: "不支持的操作" };
};
