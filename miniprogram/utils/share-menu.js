const SHARE_VERSION = 1;
const MAX_DISHES_PER_MEAL = 4;

function cleanText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function createMenuSnapshot(dateLabel, dateKey, meals) {
  return {
    v: SHARE_VERSION,
    dateLabel: cleanText(dateLabel, 30),
    dateKey: cleanText(dateKey, 10),
    meals: (Array.isArray(meals) ? meals : []).slice(0, 3).map((meal) => {
      const sourceDishes = Array.isArray(meal && meal.dishes) ? meal.dishes : [];
      const dishes = sourceDishes
        .slice(0, MAX_DISHES_PER_MEAL)
        .map((dish) => ({
          name: cleanText(dish && dish.name, 12),
          time: Math.max(0, Math.min(360, Number(dish && dish.time) || 0))
        }))
        .filter((dish) => dish.name);
      return {
        key: cleanText(meal && meal.key, 12),
        label: cleanText(meal && meal.label, 8),
        totalCount: Math.max(dishes.length, Math.min(99, sourceDishes.length)),
        totalTime: Math.max(0, Math.min(9999, sourceDishes.reduce((sum, dish) => sum + (Number(dish && dish.time) || 0), 0))),
        dishes
      };
    }).filter((meal) => meal.key && meal.label)
  };
}

function utf8Bytes(value) {
  const encoded = encodeURIComponent(value);
  const bytes = [];
  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded[index] === "%") {
      bytes.push(parseInt(encoded.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(encoded.charCodeAt(index));
    }
  }
  return new Uint8Array(bytes);
}

function bytesToText(bytes) {
  const encoded = Array.from(bytes)
    .map((byte) => `%${byte.toString(16).padStart(2, "0")}`)
    .join("");
  return decodeURIComponent(encoded);
}

function toBase64(value) {
  const bytes = utf8Bytes(value);
  if (typeof wx !== "undefined" && wx.arrayBufferToBase64) return wx.arrayBufferToBase64(bytes.buffer);
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function fromBase64(value) {
  if (typeof wx !== "undefined" && wx.base64ToArrayBuffer) {
    return bytesToText(new Uint8Array(wx.base64ToArrayBuffer(value)));
  }
  if (typeof Buffer !== "undefined") return Buffer.from(value, "base64").toString("utf8");
  const binary = atob(value);
  return bytesToText(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function encodeMenuSnapshot(snapshot) {
  const compact = {
    v: snapshot.v,
    d: snapshot.dateLabel,
    k: snapshot.dateKey,
    m: snapshot.meals.map((meal) => [
      meal.key,
      meal.label,
      meal.totalCount,
      meal.totalTime,
      meal.dishes.map((dish) => [dish.name, dish.time])
    ])
  };
  return toBase64(JSON.stringify(compact)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeMenuSnapshot(raw) {
  if (!raw) return null;
  let parsed;
  try {
    const normalized = String(raw).replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const compact = JSON.parse(fromBase64(padded));
    parsed = {
      v: compact.v,
      dateLabel: compact.d,
      dateKey: compact.k,
      meals: Array.isArray(compact.m) ? compact.m.map((meal) => ({
        key: meal[0],
        label: meal[1],
        totalCount: meal[2],
        totalTime: meal[3],
        dishes: Array.isArray(meal[4]) ? meal[4].map((dish) => ({ name: dish[0], time: dish[1] })) : []
      })) : []
    };
  } catch (error) {
    try {
      parsed = JSON.parse(String(raw)[0] === "{" ? String(raw) : decodeURIComponent(String(raw)));
    } catch (nestedError) {
      return null;
    }
  }
  if (!parsed || parsed.v !== SHARE_VERSION || !Array.isArray(parsed.meals)) return null;
  const normalized = createMenuSnapshot(parsed.dateLabel, parsed.dateKey, parsed.meals);
  normalized.meals = normalized.meals.map((meal, index) => ({
    ...meal,
    totalCount: Math.max(meal.dishes.length, Math.min(99, Number(parsed.meals[index] && parsed.meals[index].totalCount) || meal.dishes.length)),
    totalTime: Math.max(meal.totalTime, Math.min(9999, Number(parsed.meals[index] && parsed.meals[index].totalTime) || meal.totalTime))
  }));
  return normalized;
}

function menuShareTitle(snapshot) {
  const names = (snapshot && snapshot.meals || []).flatMap((meal) => meal.dishes.map((dish) => dish.name));
  if (!names.length) return "今天的菜单，等你一起安排";
  const preview = names.slice(0, 3).join("、");
  return names.length > 3 ? `今天吃${preview}等 ${names.length} 道菜` : `今天吃${preview}`;
}

module.exports = {
  createMenuSnapshot,
  decodeMenuSnapshot,
  encodeMenuSnapshot,
  menuShareTitle
};
