function recipeById(state, id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

function inferGroceryCategory(name) {
  if (["鸡翅", "排骨", "牛腩", "鸡蛋", "肉"].some((word) => name.includes(word))) return "肉蛋";
  if (["鱼", "虾", "贝"].some((word) => name.includes(word))) return "水产";
  if (["生抽", "蚝油", "可乐", "柠檬", "醋", "糖", "盐"].some((word) => name.includes(word))) return "调味品";
  if (["米", "面", "馒头", "小葱"].some((word) => name.includes(word))) return "主食";
  if (["菜", "瓜", "番茄", "土豆", "胡萝卜", "南瓜", "西兰花"].some((word) => name.includes(word))) return "蔬菜";
  return "其他";
}

function addRecipeIngredients(state, recipeId) {
  const recipe = recipeById(state, recipeId);
  if (!recipe) return 0;
  let added = 0;
  recipe.buy.forEach((name) => {
    const existing = state.groceries.find((item) => item.name === name);
    if (existing) {
      if (!existing.source.includes(recipe.name)) existing.source.push(recipe.name);
      existing.checked = false;
      return;
    }
    state.groceries.push({
      id: `g-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: inferGroceryCategory(name),
      name,
      source: [recipe.name],
      checked: false
    });
    added += 1;
  });
  return added;
}

function buildWeekPlan(recipes, offsetSeed = 0) {
  const meals = recipes.length ? recipes : [{ name: "待添加菜品", categories: [] }];
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const pick = (shift) => meals[(index * 2 + shift + offsetSeed) % meals.length].name;
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()],
      day: date.getDate(),
      meals: {
        breakfast: [pick(0)],
        lunch: [pick(1)],
        dinner: [pick(2), pick(3)]
      }
    };
  });
}

function selectedTodayRecipes(state) {
  return state.selectedToday.map((id) => recipeById(state, id)).filter(Boolean);
}

function normalizeState(state) {
  return {
    version: 2,
    recipes: Array.isArray(state.recipes) ? state.recipes : [],
    groceries: Array.isArray(state.groceries) ? state.groceries : [],
    selectedToday: Array.isArray(state.selectedToday) ? state.selectedToday : [],
    weekPlan: Array.isArray(state.weekPlan) && state.weekPlan.length === 7
      ? state.weekPlan
      : buildWeekPlan(state.recipes || [])
  };
}

module.exports = {
  addRecipeIngredients,
  buildWeekPlan,
  inferGroceryCategory,
  normalizeState,
  recipeById,
  selectedTodayRecipes
};
