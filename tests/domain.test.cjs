const test = require("node:test");
const assert = require("node:assert/strict");
const { createInitialState } = require("../miniprogram/utils/data");
const { addRecipeIngredients, buildWeekPlan, inferGroceryCategory, ingredientItemsForRecipe, mealContextForHour, normalizeState, stepItemsForRecipe } = require("../miniprogram/utils/domain");

function sampleRecipe() {
  return {
    id: "cola-wings",
    name: "可乐鸡翅",
    categories: ["荤菜"],
    ingredientItems: [
      { id: "i1", name: "鸡翅中", quantity: 8, unit: "个", inStock: false },
      { id: "i2", name: "可乐", quantity: 1, unit: "瓶", inStock: false },
      { id: "i3", name: "姜", quantity: 2, unit: "片", inStock: true }
    ],
    tags: [],
    likes: {},
    steps: [],
    favorite: false
  };
}

test("默认状态为空且保留完整的一周结构", () => {
  const state = createInitialState();
  assert.equal(state.version, 3);
  assert.equal(state.weekPlan.length, 7);
  assert.deepEqual(state.recipes, []);
  assert.deepEqual(state.groceries, []);
  assert.deepEqual(state.selectedToday, []);
  assert.ok(state.weekPlan.every((day) => Object.values(day.meals).every((meal) => meal.length === 0)));
});

test("加入食材时合并同名采购项和来源", () => {
  const state = createInitialState();
  state.recipes = [sampleRecipe()];
  addRecipeIngredients(state, "cola-wings");
  addRecipeIngredients(state, "cola-wings");
  assert.equal(state.groceries.length, 2);
  const wings = state.groceries.find((item) => item.name === "鸡翅中");
  assert.equal(wings.quantity, 8);
  assert.equal(wings.unit, "个");
  assert.deepEqual(wings.source, ["可乐鸡翅"]);

  state.recipes.push({
    ...sampleRecipe(),
    id: "cola-ribs",
    name: "可乐排骨",
    ingredientItems: [{ id: "i4", name: "可乐", quantity: 2, unit: "瓶", inStock: false }]
  });
  addRecipeIngredients(state, "cola-ribs");
  const cola = state.groceries.find((item) => item.name === "可乐");
  assert.equal(cola.quantity, 3);
  assert.deepEqual(cola.source, ["可乐鸡翅", "可乐排骨"]);
});

test("旧菜谱食材自动迁移为结构化条目", () => {
  const items = ingredientItemsForRecipe({ pantry: ["鸡蛋"], buy: ["西红柿"] });
  assert.deepEqual(items.map((item) => ({ name: item.name, quantity: item.quantity, unit: item.unit, inStock: item.inStock })), [
    { name: "鸡蛋", quantity: 1, unit: "份", inStock: true },
    { name: "西红柿", quantity: 1, unit: "份", inStock: false }
  ]);
});

test("旧菜谱做法自动迁移为结构化步骤", () => {
  assert.deepEqual(stepItemsForRecipe({ steps: "洗净西红柿\n切块后翻炒" }), [
    { id: "step-0", text: "洗净西红柿" },
    { id: "step-1", text: "切块后翻炒" }
  ]);
  assert.deepEqual(stepItemsForRecipe({ steps: ["鸡蛋打散", { id: "finish", text: "盛出装盘", duration: 2 }] }), [
    { id: "step-0", text: "鸡蛋打散" },
    { id: "finish", text: "盛出装盘", duration: 2 }
  ]);
});

test("采购分类和状态修复规则稳定", () => {
  assert.equal(inferGroceryCategory("三文鱼"), "水产");
  assert.equal(inferGroceryCategory("西兰花"), "蔬菜");
  assert.equal(inferGroceryCategory("小葱"), "蔬菜");
  const state = normalizeState({ recipes: [], groceries: [], selectedToday: [], weekPlan: [] });
  assert.equal(state.version, 3);
  assert.equal(state.weekPlan.length, 7);
});

test("重新生成一周菜单保持七天结构", () => {
  const state = createInitialState();
  state.recipes = [sampleRecipe()];
  const plan = buildWeekPlan(state.recipes, 3);
  assert.equal(plan.length, 7);
  assert.ok(plan.every((day) => day.meals.dinner.length === 2));
});

test("首页标题根据当前餐次变化", () => {
  assert.deepEqual(mealContextForHour(9), { period: "早餐", prompt: "早上吃点什么？" });
  assert.deepEqual(mealContextForHour(10), { period: "午餐", prompt: "中午吃点什么？" });
  assert.deepEqual(mealContextForHour(14), { period: "午餐", prompt: "中午吃点什么？" });
  assert.deepEqual(mealContextForHour(15), { period: "晚餐", prompt: "今晚吃点什么？" });
});
