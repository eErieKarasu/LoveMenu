function recipeById(state, id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

const TODAY_MEALS = [
  { key: "breakfast", label: "早餐", prompt: "早上吃点什么？", timeLabel: "07:00–10:00" },
  { key: "lunch", label: "午餐", prompt: "中午吃点什么？", timeLabel: "11:30–14:00" },
  { key: "dinner", label: "晚餐", prompt: "今晚吃点什么？", timeLabel: "17:30–20:00" }
];

function dateKeyForDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mealKeyForHour(hour) {
  if (hour < 10) return "breakfast";
  if (hour < 15) return "lunch";
  return "dinner";
}

function createEmptyTodayPlan(date = new Date()) {
  return {
    dateKey: dateKeyForDate(date),
    meals: { breakfast: [], lunch: [], dinner: [] }
  };
}

function normalizedTodayPlan(state) {
  const todayKey = dateKeyForDate();
  const source = state && state.todayPlan;
  if (source && source.dateKey === todayKey && source.meals) {
    return {
      dateKey: todayKey,
      meals: TODAY_MEALS.reduce((meals, meal) => {
        meals[meal.key] = Array.isArray(source.meals[meal.key])
          ? Array.from(new Set(source.meals[meal.key]))
          : [];
        return meals;
      }, {})
    };
  }

  const plan = createEmptyTodayPlan();
  const legacyIds = Array.isArray(state && state.selectedToday) ? Array.from(new Set(state.selectedToday)) : [];
  if (!source && legacyIds.length) plan.meals[mealKeyForHour(new Date().getHours())] = legacyIds;
  return plan;
}

function inferGroceryCategory(name) {
  if (["鸡翅", "排骨", "牛腩", "鸡蛋", "肉"].some((word) => name.includes(word))) return "肉蛋";
  if (["鱼", "虾", "贝"].some((word) => name.includes(word))) return "水产";
  if (["生抽", "蚝油", "可乐", "柠檬", "醋", "糖", "盐"].some((word) => name.includes(word))) return "调味品";
  if (["米", "面", "馒头"].some((word) => name.includes(word))) return "主食";
  if (["菜", "瓜", "番茄", "西红柿", "土豆", "胡萝卜", "南瓜", "西兰花", "小葱"].some((word) => name.includes(word))) return "蔬菜";
  return "其他";
}

function ingredientKey(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function normalizeStockQuantity(value) {
  if (value === "" || value === null || typeof value === "undefined") return null;
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity >= 0 ? quantity : null;
}

function normalizeInventoryItem(item, index = 0) {
  const name = String(item && item.name || "").trim();
  const quantity = normalizeStockQuantity(item && item.quantity);
  const allowedLevels = ["enough", "low", "out"];
  let level = allowedLevels.includes(item && item.level) ? item.level : "enough";
  if (quantity === 0) level = "out";
  return {
    id: item && item.id || `inventory-${index}`,
    ingredientKey: ingredientKey(item && item.ingredientKey || name),
    name,
    category: item && item.category || inferGroceryCategory(name),
    level,
    quantity,
    unit: String(item && item.unit || "份").trim() || "份",
    expiresAt: String(item && item.expiresAt || ""),
    updatedAt: Number(item && item.updatedAt) || Date.now()
  };
}

function inventoryItemForIngredient(stateOrInventory, name) {
  const inventory = Array.isArray(stateOrInventory)
    ? stateOrInventory
    : Array.isArray(stateOrInventory && stateOrInventory.inventory) ? stateOrInventory.inventory : [];
  const key = ingredientKey(name);
  return inventory.find((item) => ingredientKey(item.ingredientKey || item.name) === key);
}

function ingredientStock(inventory, ingredient) {
  const item = inventoryItemForIngredient(inventory, ingredient.name);
  const required = normalizeQuantity(ingredient.quantity);
  if (!item || item.level === "out") {
    return { item, status: "missing", shortage: required, statusText: "需要购买" };
  }
  if (item.quantity !== null && item.unit === ingredient.unit) {
    const shortage = Math.max(0, required - item.quantity);
    if (!shortage) return { item, status: "enough", shortage: 0, statusText: `库存 ${item.quantity} ${item.unit}` };
    return {
      item,
      status: item.quantity > 0 ? "low" : "missing",
      shortage,
      statusText: item.quantity > 0 ? `库存 ${item.quantity} ${item.unit}，还缺 ${shortage} ${item.unit}` : "需要购买"
    };
  }
  if (item.level === "low") {
    return { item, status: "low", shortage: required, statusText: "库存不多，建议补充" };
  }
  return { item, status: "enough", shortage: 0, statusText: "库存充足" };
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

function decorateRecipeWithInventory(recipe, inventory) {
  const ingredientItems = ingredientItemsForRecipe(recipe).map((ingredient) => {
    const stock = ingredientStock(inventory, ingredient);
    return {
      ...ingredient,
      inStock: stock.status === "enough",
      stockStatus: stock.status,
      stockText: stock.statusText,
      shortage: stock.shortage
    };
  });
  const availableCount = ingredientItems.filter((item) => item.stockStatus === "enough").length;
  const shortageCount = ingredientItems.length - availableCount;
  return {
    ...recipe,
    ingredientItems,
    ingredients: ingredientItems.map((item) => item.name),
    pantry: ingredientItems.filter((item) => item.inStock).map((item) => item.name),
    buy: ingredientItems.filter((item) => !item.inStock).map((item) => item.name),
    inventorySummary: {
      availableCount,
      shortageCount,
      totalCount: ingredientItems.length,
      ready: ingredientItems.length > 0 && shortageCount === 0,
      text: ingredientItems.length
        ? shortageCount ? `已有 ${availableCount}/${ingredientItems.length} · 缺 ${shortageCount} 样` : "库存齐全 · 可以开做"
        : "尚未录入食材"
    }
  };
}

function addRecipeIngredients(state, recipeId) {
  const recipe = recipeById(state, recipeId);
  if (!recipe) return 0;
  let added = 0;
  ingredientItemsForRecipe(recipe).forEach((ingredient) => {
    const existing = state.groceries.find((item) => ingredientKey(item.name) === ingredientKey(ingredient.name) && item.unit === ingredient.unit);
    const sourceRecipeIds = existing && Array.isArray(existing.sourceRecipeIds) && existing.sourceRecipeIds.length
      ? existing.sourceRecipeIds.slice()
      : existing ? state.recipes.filter((entry) => existing.source.includes(entry.name)).map((entry) => entry.id) : [];
    if (!sourceRecipeIds.includes(recipe.id)) sourceRecipeIds.push(recipe.id);
    const totalRequired = state.recipes
      .filter((entry) => sourceRecipeIds.includes(entry.id))
      .reduce((total, entry) => total + ingredientItemsForRecipe(entry)
        .filter((item) => ingredientKey(item.name) === ingredientKey(ingredient.name) && item.unit === ingredient.unit)
        .reduce((recipeTotal, item) => recipeTotal + item.quantity, 0), 0);
    const stock = ingredientStock(state.inventory, { ...ingredient, quantity: totalRequired });
    const purchaseQuantity = stock.shortage;
    if (!purchaseQuantity) {
      if (existing) state.groceries = state.groceries.filter((item) => item.id !== existing.id);
      return;
    }
    if (existing) {
      if (!existing.source.includes(recipe.name)) existing.source.push(recipe.name);
      existing.sourceRecipeIds = sourceRecipeIds;
      existing.quantity = purchaseQuantity;
      existing.checked = false;
      return;
    }
    state.groceries.push({
      id: `g-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: inferGroceryCategory(ingredient.name),
      name: ingredient.name,
      quantity: purchaseQuantity,
      unit: ingredient.unit,
      source: [recipe.name],
      sourceRecipeIds: [recipe.id],
      checked: false
    });
    added += 1;
  });
  return added;
}

function movePurchasedToInventory(state) {
  const purchased = state.groceries.filter((item) => item.checked);
  purchased.forEach((grocery) => {
    const existing = inventoryItemForIngredient(state, grocery.name);
    if (existing) {
      if (existing.quantity !== null && existing.unit === grocery.unit) {
        existing.quantity += normalizeQuantity(grocery.quantity);
      }
      existing.level = "enough";
      existing.category = grocery.category || existing.category;
      existing.updatedAt = Date.now();
      return;
    }
    state.inventory.push(normalizeInventoryItem({
      id: `inventory-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: grocery.name,
      category: grocery.category,
      level: "enough",
      quantity: normalizeQuantity(grocery.quantity),
      unit: grocery.unit,
      updatedAt: Date.now()
    }));
  });
  state.groceries = state.groceries.filter((item) => !item.checked);
  return purchased.length;
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

function todayRecipeIds(state, mealKey) {
  const plan = normalizedTodayPlan(state);
  if (mealKey && plan.meals[mealKey]) return plan.meals[mealKey].slice();
  return TODAY_MEALS.flatMap((meal) => plan.meals[meal.key]);
}

function selectedTodayRecipes(state, mealKey) {
  return todayRecipeIds(state, mealKey).map((id) => recipeById(state, id)).filter(Boolean);
}

function addRecipeToTodayMeal(state, recipeId, mealKey) {
  if (!recipeById(state, recipeId) || !TODAY_MEALS.some((meal) => meal.key === mealKey)) return false;
  state.todayPlan = normalizedTodayPlan(state);
  if (state.todayPlan.meals[mealKey].includes(recipeId)) return false;
  state.todayPlan.meals[mealKey].push(recipeId);
  return true;
}

function removeRecipeFromTodayMeal(state, recipeId, mealKey) {
  state.todayPlan = normalizedTodayPlan(state);
  if (!state.todayPlan.meals[mealKey]) return false;
  const previousLength = state.todayPlan.meals[mealKey].length;
  state.todayPlan.meals[mealKey] = state.todayPlan.meals[mealKey].filter((id) => id !== recipeId);
  return state.todayPlan.meals[mealKey].length !== previousLength;
}

function mealContextForHour(hour) {
  const key = mealKeyForHour(hour);
  const meal = TODAY_MEALS.find((item) => item.key === key);
  return { key, period: meal.label, prompt: meal.prompt };
}

function normalizeState(state) {
  state = state || {};
  const normalizedRecipes = Array.isArray(state.recipes) ? state.recipes.map(normalizeRecipe) : [];
  const migratedInventory = [];
  if (!Array.isArray(state.inventory)) {
    normalizedRecipes.forEach((recipe) => {
      ingredientItemsForRecipe(recipe).filter((item) => item.inStock).forEach((item) => {
        if (inventoryItemForIngredient(migratedInventory, item.name)) return;
        migratedInventory.push(normalizeInventoryItem({
          id: `inventory-migrated-${migratedInventory.length}`,
          name: item.name,
          category: inferGroceryCategory(item.name),
          level: "enough",
          quantity: null,
          unit: item.unit
        }, migratedInventory.length));
      });
    });
  }
  const inventory = (Array.isArray(state.inventory) ? state.inventory : migratedInventory)
    .map(normalizeInventoryItem)
    .filter((item) => item.name);
  return {
    version: 5,
    recipes: normalizedRecipes.map((recipe) => decorateRecipeWithInventory(recipe, inventory)),
    inventory,
    groceries: Array.isArray(state.groceries) ? state.groceries.map((item) => ({
      ...item,
      quantity: normalizeQuantity(item.quantity),
      unit: item.unit || "份",
      source: Array.isArray(item.source) ? item.source : [],
      sourceRecipeIds: Array.isArray(item.sourceRecipeIds) ? item.sourceRecipeIds : []
    })) : [],
    todayPlan: normalizedTodayPlan(state),
    weekPlan: Array.isArray(state.weekPlan) && state.weekPlan.length === 7
      ? state.weekPlan
      : buildWeekPlan(state.recipes || [])
  };
}

module.exports = {
  TODAY_MEALS,
  addRecipeToTodayMeal,
  addRecipeIngredients,
  buildWeekPlan,
  createEmptyTodayPlan,
  dateKeyForDate,
  decorateRecipeWithInventory,
  ingredientKey,
  ingredientItemsForRecipe,
  ingredientStock,
  inferGroceryCategory,
  inventoryItemForIngredient,
  mealContextForHour,
  mealKeyForHour,
  movePurchasedToInventory,
  normalizeInventoryItem,
  normalizeState,
  recipeById,
  removeRecipeFromTodayMeal,
  selectedTodayRecipes,
  stepItemsForRecipe,
  todayRecipeIds
};
