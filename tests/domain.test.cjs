const test = require("node:test");
const assert = require("node:assert/strict");
const { createInitialState } = require("../miniprogram/utils/data");
const { addRecipeIngredients, buildWeekPlan, inferGroceryCategory, normalizeState } = require("../miniprogram/utils/domain");

test("默认状态包含完整的一周和示例菜谱", () => {
  const state = createInitialState();
  assert.equal(state.version, 2);
  assert.equal(state.weekPlan.length, 7);
  assert.ok(state.recipes.length >= 8);
});

test("加入食材时合并同名采购项和来源", () => {
  const state = createInitialState();
  state.groceries = [];
  addRecipeIngredients(state, "cola-wings");
  addRecipeIngredients(state, "cola-wings");
  assert.equal(state.groceries.length, 2);
  assert.deepEqual(state.groceries.find((item) => item.name === "鸡翅中").source, ["可乐鸡翅"]);
});

test("采购分类和状态修复规则稳定", () => {
  assert.equal(inferGroceryCategory("三文鱼"), "水产");
  assert.equal(inferGroceryCategory("西兰花"), "蔬菜");
  const state = normalizeState({ recipes: [], groceries: [], selectedToday: [], weekPlan: [] });
  assert.equal(state.weekPlan.length, 7);
});

test("重新生成一周菜单保持七天结构", () => {
  const state = createInitialState();
  const plan = buildWeekPlan(state.recipes, 3);
  assert.equal(plan.length, 7);
  assert.ok(plan.every((day) => day.meals.dinner.length === 2));
});
