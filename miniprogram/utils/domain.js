function recipeById(state, id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

function inferGroceryCategory(name) {
  if (["鸡翅", "排骨", "牛腩", "鸡蛋", "肉"].some((word) => name.includes(word))) return "肉蛋";
  if (["鱼", "虾", "贝"].some((word) => name.includes(word))) return "水产";
  if (["生抽", "蚝油", "可乐", "柠檬", "醋", "糖", "盐"].some((word) => name.includes(word))) return "调味品";
  if (["米", "面", "馒头"].some((word) => name.includes(word))) return "主食";
  if (["菜", "瓜", "番茄", "西红柿", "土豆", "胡萝卜", "南瓜", "西兰花", "小葱"].some((word) => name.includes(word))) return "蔬菜";
  return "其他";
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function ingredientItemsForRecipe(recipe) {
  if (Array.isArray(recipe.ingredientItems) && recipe.ingredientItems.length) {
    return recipe.ingredientItems
      .filter((item) => item && String(item.name || "").trim())
      .map((item, index) => ({
        id: item.id || `ingredient-${index}`,
        name: String(item.name).trim(),
        quantity: normalizeQuantity(item.quantity),
        unit: String(item.unit || "份").trim() || "份",
        inStock: Boolean(item.inStock)
      }));
  }

  const pantry = Array.isArray(recipe.pantry) ? recipe.pantry : [];
  const buy = Array.isArray(recipe.buy) ? recipe.buy : [];
  return Array.from(new Set(pantry.concat(buy))).map((name, index) => ({
    id: `ingredient-${index}`,
    name,
    quantity: 1,
    unit: "份",
    inStock: pantry.includes(name)
  }));
}

function stepItemsForRecipe(recipe) {
  const source = Array.isArray(recipe.steps)
    ? recipe.steps
    : typeof recipe.steps === "string"
      ? recipe.steps.split(/\n/)
      : [];

  return source
    .map((step, index) => {
      if (typeof step === "string") {
        return { id: `step-${index}`, text: step.trim() };
      }
      if (!step || typeof step !== "object") return null;
      const normalized = {
        id: step.id || `step-${index}`,
        text: String(step.text || "").trim()
      };
      if (Number(step.duration) > 0) normalized.duration = Number(step.duration);
      return normalized;
    })
    .filter((step) => step && step.text);
}

function normalizeRecipe(recipe) {
  const ingredientItems = ingredientItemsForRecipe(recipe);
  return {
    ...recipe,
    steps: stepItemsForRecipe(recipe),
    ingredientItems,
    ingredients: ingredientItems.map((item) => item.name),
    pantry: ingredientItems.filter((item) => item.inStock).map((item) => item.name),
    buy: ingredientItems.filter((item) => !item.inStock).map((item) => item.name)
  };
}

function addRecipeIngredients(state, recipeId) {
  const recipe = recipeById(state, recipeId);
  if (!recipe) return 0;
  let added = 0;
  ingredientItemsForRecipe(recipe).filter((item) => !item.inStock).forEach((ingredient) => {
    const existing = state.groceries.find((item) => item.name === ingredient.name && item.unit === ingredient.unit);
    if (existing) {
      if (!existing.source.includes(recipe.name)) {
        existing.source.push(recipe.name);
        existing.quantity = normalizeQuantity(existing.quantity) + ingredient.quantity;
      }
      existing.checked = false;
      return;
    }
    state.groceries.push({
      id: `g-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: inferGroceryCategory(ingredient.name),
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      source: [recipe.name],
      checked: false
    });
    added += 1;
  });
  return added;
}

function buildWeekPlan(recipes, offsetSeed = 0) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const pick = (shift) => recipes.length
      ? [recipes[(index * 2 + shift + offsetSeed) % recipes.length].name]
      : [];
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()],
      day: date.getDate(),
      meals: {
        breakfast: pick(0),
        lunch: pick(1),
        dinner: pick(2).concat(pick(3))
      }
    };
  });
}

function selectedTodayRecipes(state) {
  return state.selectedToday.map((id) => recipeById(state, id)).filter(Boolean);
}

function mealContextForHour(hour) {
  if (hour < 10) return { period: "早餐", prompt: "早上吃点什么？" };
  if (hour < 15) return { period: "午餐", prompt: "中午吃点什么？" };
  return { period: "晚餐", prompt: "今晚吃点什么？" };
}

function normalizeState(state) {
  return {
    version: 3,
    recipes: Array.isArray(state.recipes) ? state.recipes.map(normalizeRecipe) : [],
    groceries: Array.isArray(state.groceries) ? state.groceries.map((item) => ({
      ...item,
      quantity: normalizeQuantity(item.quantity),
      unit: item.unit || "份",
      source: Array.isArray(item.source) ? item.source : []
    })) : [],
    selectedToday: Array.isArray(state.selectedToday) ? state.selectedToday : [],
    weekPlan: Array.isArray(state.weekPlan) && state.weekPlan.length === 7
      ? state.weekPlan
      : buildWeekPlan(state.recipes || [])
  };
}

module.exports = {
  addRecipeIngredients,
  buildWeekPlan,
  ingredientItemsForRecipe,
  inferGroceryCategory,
  mealContextForHour,
  normalizeState,
  recipeById,
  selectedTodayRecipes,
  stepItemsForRecipe
};
