const { CATEGORIES } = require("./constants");

const AI_DRAFT_STORAGE_KEY = "lovemenu-ai-recipe-draft-v1";
const INGREDIENT_UNITS = ["个", "克", "斤", "毫升", "升", "勺", "根", "把", "片", "块", "颗", "瓶", "袋", "盒", "份"];
const DIFFICULTIES = ["简单", "普通", "进阶"];
const RECIPE_CATEGORIES = CATEGORIES.filter((item) => item !== "全部");

function cleanText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function boundedNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function shouldIncludeInventory(prompt) {
  const text = cleanText(prompt, 600);
  if (!text) return false;
  if (/不(?:要|用|使用|考虑).{0,6}库存|无需.{0,6}库存/.test(text)) return false;
  return text === "用家里现有的食材做一道菜" || /库存/.test(text);
}

function normalizeGeneratedRecipe(value) {
  if (!value || typeof value !== "object") return null;
  const name = cleanText(value.name, 30);
  const ingredientItems = (Array.isArray(value.ingredientItems) ? value.ingredientItems : [])
    .map((item) => ({
      name: cleanText(item && item.name, 24),
      quantity: boundedNumber(item && item.quantity, 1, 1, 9999),
      unit: INGREDIENT_UNITS.includes(item && item.unit) ? item.unit : "份"
    }))
    .filter((item) => item.name)
    .slice(0, 20);
  const steps = (Array.isArray(value.steps) ? value.steps : [])
    .map((item) => cleanText(typeof item === "string" ? item : item && item.text, 180))
    .filter(Boolean)
    .slice(0, 12)
    .map((text) => ({ text }));

  if (!name || ingredientItems.length < 2 || steps.length < 2) return null;

  const categories = Array.from(new Set((Array.isArray(value.categories) ? value.categories : [])
    .filter((item) => RECIPE_CATEGORIES.includes(item))));
  const tags = Array.from(new Set((Array.isArray(value.tags) ? value.tags : [])
    .map((item) => cleanText(item, 10))
    .filter(Boolean)))
    .slice(0, 5);

  return {
    name,
    categories: categories.length ? categories : ["快手菜"],
    prep: boundedNumber(value.prep, 10, 1, 180),
    cook: boundedNumber(value.cook, 15, 1, 180),
    difficulty: DIFFICULTIES.includes(value.difficulty) ? value.difficulty : "简单",
    flavor: cleanText(value.flavor, 12) || "家常",
    spice: cleanText(value.spice, 12) || "不辣",
    tags,
    ingredientItems,
    steps
  };
}

module.exports = {
  AI_DRAFT_STORAGE_KEY,
  DIFFICULTIES,
  INGREDIENT_UNITS,
  RECIPE_CATEGORIES,
  normalizeGeneratedRecipe,
  shouldIncludeInventory
};
