function recentStatus(value) {
  const text = String(value || "最近").trim() || "最近";
  return text.endsWith("做过") ? text : `${text}做过`;
}

function recentDescription(recipe = {}) {
  const explicit = String(recipe.description || "").trim();
  if (explicit) return explicit;

  const flavor = String(recipe.flavor || "").trim();
  if (flavor.includes("酸甜")) return "酸甜开胃，家人都爱吃。";
  if (/香辣|麻辣|微辣|中辣|重辣/.test(flavor) || /香辣|麻辣|微辣|中辣|重辣/.test(String(recipe.spice || ""))) {
    return "香辣下饭，很适合再做一次。";
  }
  if (/清淡|清爽/.test(flavor)) return "清爽家常，吃起来没有负担。";

  const tags = Array.isArray(recipe.tags) ? recipe.tags.filter(Boolean) : [];
  if (tags.length) return `${tags[0]}又家常，适合再做一次。`;
  return "熟悉的家常味，随时可以再做一次。";
}

function recentRecipeCard(recipe) {
  if (!recipe) return null;
  return {
    ...recipe,
    imageSrc: recipe.image || "",
    statusText: recentStatus(recipe.recent),
    descriptionText: recentDescription(recipe)
  };
}

module.exports = { recentDescription, recentRecipeCard, recentStatus };
