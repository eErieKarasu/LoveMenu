const categories = ["全部", "荤菜", "素菜", "汤", "主食", "早餐", "快手菜"];
const dishCategories = categories.filter(category => category !== "全部");
const addTagOptions = ["快手", "下饭", "清淡", "少辣", "多菜少肉", "适合晚餐"];
const familyMembers = ["我", "伴侣", "小朋友"];
const preferenceOptions = ["喜欢", "一般", "不爱吃"];

let recipes = [
  {
    id: "tomato-egg",
    name: "番茄炒蛋",
    categories: ["快手菜"],
    ingredients: ["番茄", "鸡蛋", "小葱"],
    pantry: ["鸡蛋", "小葱", "盐"],
    buy: ["番茄"],
    prep: 5,
    cook: 7,
    time: 12,
    difficulty: "简单",
    flavor: "清淡",
    spice: "不辣",
    tags: ["快手", "下饭", "适合晚餐"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "喜欢" },
    steps: ["番茄去蒂切块，鸡蛋加少量盐打散。", "热锅滑蛋至刚凝固，盛出备用。", "番茄炒出汁后回锅鸡蛋，轻轻翻匀。"],
    favorite: true,
    recent: "3 天前",
    notThisWeek: false
  },
  {
    id: "broccoli",
    name: "清炒西兰花",
    categories: ["素菜", "快手菜"],
    ingredients: ["西兰花", "蒜", "橄榄油"],
    pantry: ["蒜", "盐", "橄榄油"],
    buy: ["西兰花"],
    prep: 6,
    cook: 6,
    time: 12,
    difficulty: "简单",
    flavor: "清爽",
    spice: "不辣",
    tags: ["多菜少肉", "清淡", "快手"],
    likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "一般" },
    steps: ["西兰花掰小朵，淡盐水浸泡后焯 40 秒。", "蒜片小火煸香，放入西兰花。", "少量盐调味，保持脆口即可出锅。"],
    favorite: false,
    recent: "5 天前",
    notThisWeek: false
  },
  {
    id: "cola-wings",
    name: "可乐鸡翅",
    categories: ["荤菜"],
    ingredients: ["鸡翅中", "可乐", "姜"],
    pantry: ["姜", "生抽", "老抽"],
    buy: ["鸡翅中", "可乐"],
    prep: 8,
    cook: 22,
    time: 30,
    difficulty: "普通",
    flavor: "微甜",
    spice: "不辣",
    tags: ["小朋友喜欢", "周末", "下饭"],
    likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "喜欢" },
    steps: ["鸡翅划两刀，冷水下锅焯去浮沫。", "煎至两面微黄，加入姜片、生抽和可乐。", "中小火收汁，汤汁能挂住鸡翅即可。"],
    favorite: true,
    recent: "上周",
    notThisWeek: true
  },
  {
    id: "seaweed-soup",
    name: "紫菜蛋花汤",
    categories: ["汤", "快手菜"],
    ingredients: ["紫菜", "鸡蛋", "虾皮"],
    pantry: ["紫菜", "鸡蛋", "香油"],
    buy: ["虾皮"],
    prep: 3,
    cook: 5,
    time: 8,
    difficulty: "简单",
    flavor: "清淡",
    spice: "不辣",
    tags: ["快手汤", "清淡", "早餐也可"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "喜欢" },
    steps: ["清水煮开后放入紫菜和虾皮。", "鸡蛋液细细淋入锅中形成蛋花。", "关火后滴香油，按口味加盐。"],
    favorite: true,
    recent: "昨天",
    notThisWeek: false
  },
  {
    id: "beef-potato",
    name: "土豆炖牛腩",
    categories: ["荤菜"],
    ingredients: ["牛腩", "土豆", "胡萝卜"],
    pantry: ["八角", "生抽", "姜"],
    buy: ["牛腩", "土豆", "胡萝卜"],
    prep: 15,
    cook: 70,
    time: 85,
    difficulty: "进阶",
    flavor: "浓郁",
    spice: "微辣可选",
    tags: ["周末", "耐心菜", "适合晚餐"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "一般" },
    steps: ["牛腩焯水后冲净，土豆和胡萝卜切大块。", "牛腩与香料煸香，加热水炖至软烂。", "加入土豆胡萝卜再炖 20 分钟，收至汤汁浓厚。"],
    favorite: false,
    recent: "半个月前",
    notThisWeek: true
  },
  {
    id: "lettuce",
    name: "蒜蓉生菜",
    categories: ["素菜", "快手菜"],
    ingredients: ["生菜", "蒜", "蚝油"],
    pantry: ["蒜", "蚝油"],
    buy: ["生菜"],
    prep: 4,
    cook: 4,
    time: 8,
    difficulty: "简单",
    flavor: "清爽",
    spice: "不辣",
    tags: ["多菜少肉", "快手", "清淡"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "不爱吃" },
    steps: ["生菜洗净沥干，蒜切末。", "蒜末小火炒香，加入少量蚝油和水。", "放入生菜快速翻匀，断生即出锅。"],
    favorite: false,
    recent: "4 天前",
    notThisWeek: false
  },
  {
    id: "salmon",
    name: "香煎三文鱼",
    categories: ["荤菜", "快手菜"],
    ingredients: ["三文鱼", "柠檬", "黑胡椒"],
    pantry: ["黑胡椒", "海盐", "橄榄油"],
    buy: ["三文鱼", "柠檬"],
    prep: 5,
    cook: 9,
    time: 14,
    difficulty: "普通",
    flavor: "鲜香",
    spice: "不辣",
    tags: ["少辣", "鱼类", "轻晚餐"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "一般" },
    steps: ["三文鱼擦干，两面撒海盐和黑胡椒。", "中火先煎鱼皮面，至边缘变色。", "翻面再煎 2 分钟，出锅挤少量柠檬汁。"],
    favorite: true,
    recent: "两周前",
    notThisWeek: true
  },
  {
    id: "millet",
    name: "小米粥",
    categories: ["早餐", "主食"],
    ingredients: ["小米", "南瓜", "清水"],
    pantry: ["小米"],
    buy: ["南瓜"],
    prep: 3,
    cook: 28,
    time: 31,
    difficulty: "简单",
    flavor: "温和",
    spice: "不辣",
    tags: ["早餐", "暖胃", "小朋友喜欢"],
    likes: { "我": "一般", "伴侣": "喜欢", "小朋友": "喜欢" },
    steps: ["小米淘洗后浸泡 10 分钟。", "南瓜切小块，与小米一同入锅。", "小火煮至米粒开花，静置 3 分钟更稠。"],
    favorite: false,
    recent: "今天早上",
    notThisWeek: false
  },
  {
    id: "scallion-noodle",
    name: "葱油拌面",
    categories: ["主食", "快手菜"],
    ingredients: ["面条", "小葱", "生抽"],
    pantry: ["面条", "生抽", "白糖"],
    buy: ["小葱"],
    prep: 5,
    cook: 10,
    time: 15,
    difficulty: "简单",
    flavor: "咸香",
    spice: "不辣",
    tags: ["快手主食", "宵夜", "少洗碗"],
    likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "喜欢" },
    steps: ["小葱切段，小火炸至边缘微焦。", "生抽、老抽、少量糖调成酱汁。", "面条煮熟拌入葱油和酱汁。"],
    favorite: true,
    recent: "6 天前",
    notThisWeek: false
  },
  {
    id: "wintermelon-soup",
    name: "冬瓜排骨汤",
    categories: ["汤", "荤菜"],
    ingredients: ["冬瓜", "排骨", "姜"],
    pantry: ["姜", "盐"],
    buy: ["冬瓜", "排骨"],
    prep: 12,
    cook: 55,
    time: 67,
    difficulty: "普通",
    flavor: "清润",
    spice: "不辣",
    tags: ["清淡", "适合周末", "汤"],
    likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "一般" },
    steps: ["排骨冷水下锅焯水，洗净浮沫。", "排骨和姜片先炖 40 分钟。", "加入冬瓜再煮 15 分钟，出锅前调盐。"],
    favorite: false,
    recent: "上周",
    notThisWeek: true
  }
];

const grocerySeed = [
  { id: "g1", category: "蔬菜", name: "西兰花", source: ["清炒西兰花"], checked: false },
  { id: "g2", category: "蔬菜", name: "番茄", source: ["番茄炒蛋"], checked: true },
  { id: "g3", category: "蔬菜", name: "生菜", source: ["蒜蓉生菜"], checked: false },
  { id: "g4", category: "肉蛋", name: "鸡翅中", source: ["可乐鸡翅"], checked: false },
  { id: "g5", category: "肉蛋", name: "排骨", source: ["冬瓜排骨汤"], checked: false },
  { id: "g6", category: "水产", name: "三文鱼", source: ["香煎三文鱼"], checked: false },
  { id: "g7", category: "调味品", name: "可乐", source: ["可乐鸡翅"], checked: false },
  { id: "g8", category: "主食", name: "小葱", source: ["葱油拌面", "番茄炒蛋"], checked: true },
  { id: "g9", category: "其他", name: "柠檬", source: ["香煎三文鱼"], checked: false }
];

function createDefaultAddForm() {
  return {
    name: "",
    categories: ["快手菜"],
    tags: ["快手", "适合晚餐"],
    prep: 8,
    cook: 12,
    difficulty: "简单",
    pantry: [],
    buy: [],
    steps: ["处理主要食材，切成家里习惯的大小。", "热锅后按顺序下锅，先炒香再调味。", "出锅前试味，按少辣或清淡偏好微调。"],
    preferences: { "我": "喜欢", "伴侣": "一般", "小朋友": "喜欢" },
    toggles: { lessSpicy: true, moreVeg: false },
    errors: {},
    saving: false,
    saved: false,
    lastSavedName: ""
  };
}

const state = {
  page: "today",
  category: "全部",
  query: "",
  selectedRecipeId: "tomato-egg",
  selectedDay: 0,
  selectedToday: [],
  addForm: createDefaultAddForm(),
  groceries: grocerySeed.map(item => ({ ...item, source: [...item.source] })),
  loading: true,
  toastTimer: null,
  syncStatus: "正在连接 Sites 数据库"
};

let weekPlan = createWeekPlan();
let persistenceReady = false;
let persistenceTimer = null;
let lastPersistedSnapshot = "";

function createPersistentSnapshot() {
  return {
    version: 1,
    recipes,
    groceries: state.groceries,
    selectedToday: state.selectedToday,
    weekPlan,
    addForm: state.addForm
  };
}

function applyPersistentSnapshot(snapshot) {
  if (!snapshot || snapshot.version !== 1) return false;
  if (Array.isArray(snapshot.recipes) && snapshot.recipes.length) recipes = snapshot.recipes;
  if (Array.isArray(snapshot.groceries)) state.groceries = snapshot.groceries;
  if (Array.isArray(snapshot.selectedToday)) state.selectedToday = snapshot.selectedToday;
  if (Array.isArray(snapshot.weekPlan) && snapshot.weekPlan.length === 7) weekPlan = snapshot.weekPlan;
  if (snapshot.addForm && typeof snapshot.addForm === "object") state.addForm = snapshot.addForm;
  return true;
}

async function hydratePersistentState() {
  try {
    const response = await fetch("/api/state", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const restored = applyPersistentSnapshot(payload.state);
    state.syncStatus = "已安全保存到 Sites 数据库";
    persistenceReady = true;
    lastPersistedSnapshot = restored ? JSON.stringify(createPersistentSnapshot()) : "";
  } catch (error) {
    console.error("LoveMenu data hydration failed", error);
    state.syncStatus = "数据库暂时无法连接";
  }
}

function schedulePersistence() {
  if (!persistenceReady) return;
  const serialized = JSON.stringify(createPersistentSnapshot());
  if (serialized === lastPersistedSnapshot) return;
  clearTimeout(persistenceTimer);
  state.syncStatus = "正在保存更改";
  persistenceTimer = window.setTimeout(async () => {
    try {
      const response = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: serialized
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      lastPersistedSnapshot = serialized;
      state.syncStatus = "已安全保存到 Sites 数据库";
    } catch (error) {
      console.error("LoveMenu data persistence failed", error);
      state.syncStatus = "保存失败，稍后再试";
    }
  }, 420);
}

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function recipeById(id) {
  return recipes.find(recipe => recipe.id === id);
}

function getTodayParts(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
  return {
    date,
    day: date.getDate(),
    month: date.getMonth() + 1,
    week,
    label: `${date.getMonth() + 1}月${date.getDate()}日 ${week}`
  };
}

function currentPeriod() {
  const hour = new Date().getHours();
  if (hour < 10) return "早餐";
  if (hour < 15) return "午餐";
  return "晚餐";
}

function spicePill(recipe) {
  if (recipe.spice.includes("辣")) return `<span class="pill rose">${icon("flame")}${recipe.spice}</span>`;
  return `<span class="pill sage">${icon("leaf")}${recipe.spice}</span>`;
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `${renderCurrentPage()}${renderBottomNav()}`;
  schedulePersistence();
}

function renderCurrentPage() {
  if (state.loading) return renderLoading();
  if (state.page === "today") return renderToday();
  if (state.page === "recipes") return renderRecipes();
  if (state.page === "add") return renderAddDish();
  if (state.page === "detail") return renderDetail();
  if (state.page === "week") return renderWeek();
  if (state.page === "grocery") return renderGrocery();
  return renderMine();
}

function renderLoading() {
  return `
    <section class="screen">
      <div class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">LoveMenu</p>
          <h1 class="title">正在整理家里的菜单</h1>
        </div>
      </div>
      <div class="skeleton-list">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </section>
  `;
}

function renderToday() {
  const today = getTodayParts();
  const selected = selectedTodayRecipes();
  const recent = recipes.filter(recipe => !recipe.notThisWeek).slice(0, 5);
  const hasSelected = selected.length > 0;

  return `
    <section class="screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">${today.label} · ${currentPeriod()}</p>
          <h1 class="title">${hasSelected ? "今日已选菜单" : "今晚吃点什么？"}</h1>
          <p class="subtitle">${hasSelected ? `已选 ${selected.length} 道，按家里真实想吃的来，不需要凑齐汤、主食或素菜。` : "还没决定今天吃什么，先去菜谱里挑一道家里想吃的菜。"}</p>
        </div>
      </header>

      ${hasSelected ? renderSelectedTodayCard(selected) : renderEmptyTodayCard()}

      <section class="section">
        <h2 class="section-title">快速点菜</h2>
        <div class="horizontal-list">
          ${recent.map(recipe => renderMiniDish(recipe)).join("")}
        </div>
      </section>
    </section>
  `;
}

function selectedTodayRecipes() {
  return state.selectedToday.map(recipeById).filter(Boolean);
}

function recipeCategoryLabel(recipe) {
  return recipe.categories.filter(category => category !== "快手菜").slice(0, 2).join(" / ") || recipe.categories[0] || "菜品";
}

function recipesTotalTime(items) {
  return items.reduce((sum, recipe) => sum + recipe.time, 0);
}

function renderSelectedTodayCard(selected) {
  return `
    <section class="hero-card selected-menu-card">
      <div class="hero-topline">
        <span class="meal-period">${icon("today")}已选菜单</span>
        <span class="date-note">${selected.length} 道 · 约 ${recipesTotalTime(selected)} 分钟</span>
      </div>
      <p class="today-note">这是今天真正决定要吃的菜。想只吃一道、不要汤、不要主食，都可以。</p>
      <div class="selected-dish-list">
        ${selected.map(renderSelectedDish).join("")}
      </div>
      <div class="action-row">
        <button class="secondary-btn" type="button" onclick="goRecipes()">${icon("plus")}继续加菜</button>
        <button class="primary-btn" type="button" onclick="addSelectedTodayToGrocery()">${icon("grocery")}加入采购清单</button>
      </div>
    </section>
  `;
}

function renderSelectedDish(recipe) {
  return `
    <article class="selected-dish">
      <div class="dish-mark ${recipe.categories.includes("素菜") ? "sage" : recipe.categories.includes("汤") ? "blue" : recipe.categories.includes("主食") ? "rose" : ""}">${icon(recipe.categories.includes("素菜") ? "leaf" : recipe.categories.includes("汤") ? "today" : "star")}</div>
      <div>
        <p class="dish-name">${recipe.name}</p>
        <div class="dish-meta">
          <span class="pill accent">${recipeCategoryLabel(recipe)}</span>
          <span class="pill">${icon("clock")}${recipe.time} 分钟</span>
          <span class="pill blue">${recipe.flavor}</span>
          ${spicePill(recipe)}
        </div>
      </div>
      <button class="dish-remove-btn" type="button" onclick="removeTodayDish('${recipe.id}')" aria-label="从今日菜单移除 ${recipe.name}">${icon("check")}</button>
    </article>
  `;
}

function renderEmptyTodayCard() {
  return `
    <section class="hero-card empty-today-card">
      <div class="hero-topline">
        <span class="meal-period">${icon("today")}还没选菜</span>
        <span class="date-note">等待手动选择</span>
      </div>
      <div class="empty-today-body">
        <strong>今天还没决定吃什么</strong>
        <p>先从菜谱里挑真正想吃的菜。这里暂时只做手动选择，也不会默认要求你配齐汤、主食或素菜。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn full-row" type="button" onclick="goRecipes()">${icon("book")}去菜谱点菜</button>
      </div>
    </section>
  `;
}

function renderMiniDish(recipe) {
  return `
    <button class="mini-dish" type="button" onclick="openRecipe('${recipe.id}')">
      <strong>${recipe.name}</strong>
      <span>${recipe.recent} · ${recipe.tags.slice(0, 2).join(" / ")}</span>
    </button>
  `;
}

function renderRecipes() {
  const filtered = recipes.filter(recipe => {
    const matchCategory = state.category === "全部" || recipe.categories.includes(state.category);
    const text = `${recipe.name} ${recipe.ingredients.join(" ")} ${recipe.tags.join(" ")}`;
    return matchCategory && text.includes(state.query.trim());
  });

  return `
    <section class="screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">家庭常做菜</p>
          <h1 class="title">菜谱库</h1>
        </div>
        <button class="round-icon-btn" type="button" onclick="openAddDish()" aria-label="新增菜品">${icon("plus")}</button>
      </header>

      <label class="search-panel">
        ${icon("search")}
        <input type="search" value="${state.query}" placeholder="搜索菜名、食材或标签" oninput="setSearch(this.value)" />
      </label>

      <div class="tabs" role="tablist" aria-label="菜谱分类">
        ${categories.map(category => `
          <button class="chip ${state.category === category ? "active" : ""}" type="button" onclick="setCategory('${category}')">${category}</button>
        `).join("")}
      </div>

      ${filtered.length ? `
        <div class="recipe-list">
          ${filtered.map(recipe => renderRecipeCard(recipe)).join("")}
        </div>
      ` : renderEmpty("search", "没有找到合适的菜", "换个关键词，或者点右上角新增一道家里常做菜。")}
    </section>
  `;
}

function renderRecipeCard(recipe) {
  const likeText = Object.entries(recipe.likes).map(([member, value]) => `${member}${value}`).join(" · ");
  const inToday = state.selectedToday.includes(recipe.id);
  return `
    <article class="recipe-card">
      <div class="recipe-card-body" role="button" tabindex="0" onclick="openRecipe('${recipe.id}')" onkeydown="handleRecipeCardKey(event, '${recipe.id}')">
        <div class="recipe-title-row">
          <h2 class="recipe-title">${recipe.name}</h2>
          <span class="pill">${icon("clock")}${recipe.time} 分钟</span>
        </div>
        <p class="recipe-ingredients">${recipe.ingredients.join(" / ")} · ${recipe.difficulty}</p>
        <div class="family-tags">
          <span class="pill sage">${likeText}</span>
          <span class="pill blue">${recipe.tags[0]}</span>
        </div>
      </div>
      <div class="recipe-action-cell">
        <button class="recipe-add-btn ${inToday ? "added" : ""}" type="button" onclick="quickAddToToday(event, '${recipe.id}')" aria-label="${inToday ? `已加入今日菜单 ${recipe.name}` : `添加 ${recipe.name} 到今日菜单`}">
          ${inToday ? "已加" : "添加"}
        </button>
      </div>
    </article>
  `;
}

function renderAddDish() {
  const form = state.addForm;
  return `
    <section class="screen add-screen">
      <header class="screen-header add-header">
        <button class="back-btn" type="button" onclick="goRecipes()" aria-label="返回菜谱库">${icon("chevron")}</button>
        <div class="header-stack">
          <p class="eyebrow">新增菜品</p>
          <h1 class="title">记一道家常菜</h1>
          <p class="subtitle">先保存关键做法和家人口味，之后可以继续补全。</p>
        </div>
        <button class="round-icon-btn" type="button" onclick="saveDraft()" aria-label="保存草稿">${icon("check")}</button>
      </header>

      ${form.saved ? `
        <section class="success-card">
          <div class="success-icon">${icon("check")}</div>
          <div>
            <strong>${escapeHtml(form.lastSavedName)} 已加入菜谱库</strong>
            <span>可以回到菜谱库继续浏览，或再新增下一道家里常做菜。</span>
          </div>
        </section>
      ` : ""}

      <section class="form-card">
        <div class="form-card-title">
          <div>
            <h2>基础信息</h2>
            <p>打开菜谱库时最先被检索和筛选的内容。</p>
          </div>
        </div>
        <label class="field-group ${form.errors.name ? "has-error" : ""}">
          <span class="field-label">菜名</span>
          <input class="form-input" type="text" value="${escapeHtml(form.name)}" placeholder="例如：番茄炒蛋" oninput="updateAddField('name', this.value)" />
          ${form.errors.name ? `<span class="field-error">先填一个菜名，保存后才好找。</span>` : ""}
        </label>
        <div class="field-group">
          <span class="field-label">分类</span>
          <div class="chip-wrap">
            ${dishCategories.map(category => `
              <button class="choice-chip ${form.categories.includes(category) ? "active" : ""}" type="button" onclick="toggleAddCategory('${category}')">${category}</button>
            `).join("")}
          </div>
        </div>
        <div class="field-group">
          <span class="field-label">标签</span>
          <div class="chip-wrap">
            ${addTagOptions.map(tag => `
              <button class="choice-chip small ${form.tags.includes(tag) ? "active" : ""}" type="button" onclick="toggleAddTag('${tag}')">${tag}</button>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="form-card">
        <div class="form-card-title">
          <div>
            <h2>时间和难度</h2>
            <p>用于饭前快速判断今天能不能做。</p>
          </div>
        </div>
        ${renderStepper("准备时间", "prep", "洗切备料", form.prep)}
        ${renderStepper("烹饪时间", "cook", "下锅到出菜", form.cook)}
        <div class="field-group">
          <span class="field-label">难度</span>
          <div class="segmented" role="group" aria-label="难度">
            ${["简单", "普通", "进阶"].map(level => `
              <button class="${form.difficulty === level ? "active" : ""}" type="button" onclick="setAddDifficulty('${level}')">${level}</button>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="form-card">
        <div class="form-card-title">
          <div>
            <h2>食材</h2>
            <p>区分家里常备和需要购买，采购清单可以直接复用。</p>
          </div>
        </div>
        ${renderIngredientEditor("pantry", "家里常备", "平时冰箱或调料区常有")}
        ${renderIngredientEditor("buy", "需要购买", "做这道菜前要补齐")}
      </section>

      <section class="form-card">
        <div class="form-card-title">
          <div>
            <h2>简洁步骤</h2>
            <p>每步尽量一句话，饭前查看更快。</p>
          </div>
        </div>
        <div class="step-edit-list">
          ${form.steps.map((step, index) => `
            <div class="step-edit-row">
              <div class="step-index">${index + 1}</div>
              <textarea class="form-textarea" rows="2" placeholder="第 ${index + 1} 步" oninput="updateStep(${index}, this.value)">${escapeHtml(step)}</textarea>
              ${form.steps.length > 1 ? `<button class="remove-mini-btn" type="button" onclick="removeStep(${index})" aria-label="删除第 ${index + 1} 步">删</button>` : ""}
            </div>
          `).join("")}
        </div>
        <button class="inline-add" type="button" onclick="addStep()">${icon("plus")}添加步骤</button>
      </section>

      <section class="form-card">
        <div class="form-card-title">
          <div>
            <h2>家庭偏好</h2>
            <p>保存后会显示在菜品卡片里，方便家人点菜。</p>
          </div>
        </div>
        <div class="preference-list">
          ${familyMembers.map(member => `
            <div class="preference-row">
              <div>
                <strong>${member}</strong>
                <span>${member === "我" ? "默认口味" : member === "伴侣" ? "晚餐参考" : "少辣优先"}</span>
              </div>
              <div class="choice-row" role="group" aria-label="${member}偏好">
                ${preferenceOptions.map(option => `
                  <button class="${form.preferences[member] === option ? "active" : ""}" type="button" onclick="setPreference('${member}', '${option}')">${option}</button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        <div class="toggle-list">
          ${renderPreferenceToggle("lessSpicy", "少辣", "默认按家里清淡口味记录")}
          ${renderPreferenceToggle("moreVeg", "多菜少肉", "适合做一周菜单平衡提醒")}
        </div>
      </section>

      <div class="bottom-form-actions">
        <button class="secondary-btn" type="button" onclick="saveDraft()" ${form.saving ? "disabled" : ""}>保存草稿</button>
        <button class="primary-btn" type="button" onclick="saveNewDish()" ${form.saving ? "disabled" : ""}>
          ${form.saving ? `${icon("refresh")}保存中` : `${icon("check")}保存菜品`}
        </button>
      </div>
    </section>
  `;
}

function renderStepper(label, field, note, value) {
  return `
    <div class="stepper-row">
      <div>
        <strong>${label}</strong>
        <span>${note}</span>
      </div>
      <div class="stepper" aria-label="${label}">
        <button type="button" onclick="adjustAddTime('${field}', -1)" aria-label="减少${label}">-</button>
        <span>${value} 分钟</span>
        <button type="button" onclick="adjustAddTime('${field}', 1)" aria-label="增加${label}">+</button>
      </div>
    </div>
  `;
}

function renderIngredientEditor(type, title, description) {
  const list = state.addForm[type];
  return `
    <div class="ingredient-editor">
      <div class="editor-heading">
        <div>
          <strong>${title}</strong>
          <span>${description}</span>
        </div>
        <button class="inline-add compact" type="button" onclick="addIngredient('${type}')" aria-label="添加${title}">${icon("plus")}添加</button>
      </div>
      <div class="ingredient-edit-list">
        ${list.length ? list.map((item, index) => `
          <div class="ingredient-edit-row">
            <div class="ingredient-fields">
              <input class="form-input" type="text" value="${escapeHtml(item.name)}" placeholder="${type === "pantry" ? "鸡蛋" : "西兰花"}" oninput="updateIngredient('${type}', ${index}, 'name', this.value)" aria-label="${title}名称 ${index + 1}" />
              <input class="form-input amount-input" type="text" value="${escapeHtml(item.amount)}" placeholder="${type === "pantry" ? "2 个" : "1 颗"}" oninput="updateIngredient('${type}', ${index}, 'amount', this.value)" aria-label="${title}用量 ${index + 1}" />
            </div>
            <button class="remove-mini-btn" type="button" onclick="removeIngredient('${type}', ${index})" aria-label="删除${title} ${index + 1}">删</button>
          </div>
        `).join("") : `
          <button class="empty-inline" type="button" onclick="addIngredient('${type}')">
            ${icon("plus")}还没有${title}，点我添加
          </button>
        `}
      </div>
    </div>
  `;
}

function renderPreferenceToggle(key, title, description) {
  const active = state.addForm.toggles[key];
  return `
    <button class="toggle-row ${active ? "active" : ""}" type="button" onclick="toggleAddToggle('${key}')">
      <span>
        <strong>${title}</strong>
        <small>${description}</small>
      </span>
      <i class="toggle-switch" aria-hidden="true"></i>
    </button>
  `;
}

function renderDetail() {
  const recipe = recipeById(state.selectedRecipeId) || recipes[0];
  return `
    <section class="screen">
      <header class="screen-header">
        <button class="back-btn" type="button" onclick="goRecipes()" aria-label="返回菜谱库">${icon("chevron")}</button>
        <button class="round-icon-btn" type="button" onclick="toggleFavorite(event, '${recipe.id}')" aria-label="收藏">${icon("heart")}</button>
      </header>

      <section class="detail-hero">
        <div class="dish-meta">
          ${recipe.tags.map((tag, index) => `<span class="pill ${index === 0 ? "accent" : index === 1 ? "sage" : "blue"}">${tag}</span>`).join("")}
        </div>
        <h1 class="detail-title">${recipe.name}</h1>
        <div class="stat-grid">
          <div class="stat"><span>准备</span><strong>${recipe.prep} 分钟</strong></div>
          <div class="stat"><span>烹饪</span><strong>${recipe.cook} 分钟</strong></div>
          <div class="stat"><span>难度</span><strong>${recipe.difficulty}</strong></div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">食材</h2>
        <div class="ingredient-list">
          ${recipe.pantry.map(item => renderIngredient(item, "家里常备", false)).join("")}
          ${recipe.buy.map(item => renderIngredient(item, "需要购买", true)).join("")}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">做法</h2>
        <div class="steps">
          ${recipe.steps.map((step, index) => `
            <div class="step-item">
              <div class="step-index">${index + 1}</div>
              <div><strong>${step}</strong><span>保持步骤短，饭前查看不用反复滑动。</span></div>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">家庭评分</h2>
        <div class="score-list">
          ${Object.entries(recipe.likes).map(([member, value]) => `
            <div class="score-item">
              ${icon(value === "喜欢" ? "heart" : value === "一般" ? "star" : "leaf")}
              <div><strong>${member}：${value}</strong><span>${value === "不爱吃" ? "可替换为同类清淡蔬菜" : "适合加入常用菜单"}</span></div>
            </div>
          `).join("")}
        </div>
      </section>

      <div class="detail-actions">
        <button class="primary-btn" type="button" onclick="addToToday('${recipe.id}')">${icon("today")}加入今日菜单</button>
        <button class="secondary-btn" type="button" onclick="addRecipeToGrocery('${recipe.id}')">${icon("grocery")}加入采购清单</button>
        <button class="secondary-btn" type="button" onclick="showToast('编辑入口已预留，后续可改成真实表单')">${icon("edit")}编辑</button>
      </div>
    </section>
  `;
}

function renderIngredient(name, note, buy) {
  return `
    <div class="ingredient-item">
      <span class="ingredient-dot ${buy ? "buy" : ""}"></span>
      <div><strong>${name}</strong><span>${note}</span></div>
    </div>
  `;
}

function renderWeek() {
  const selected = weekPlan[state.selectedDay];
  return `
    <section class="screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">未来 7 天</p>
          <h1 class="title">一周菜单规划</h1>
        </div>
        <button class="round-icon-btn" type="button" onclick="autoGenerateWeek()" aria-label="自动生成一周菜单">${icon("refresh")}</button>
      </header>

      <div class="date-strip">
        ${weekPlan.map((day, index) => `
          <button class="date-pill ${index === state.selectedDay ? "active" : ""}" type="button" onclick="selectWeekDay(${index})">
            <span>${day.week}</span>
            <strong>${day.day}</strong>
          </button>
        `).join("")}
      </div>

      <div class="balance-card">
        <p><strong>平衡提醒</strong></p>
        <p>本周鱼类偏少，可以加入香煎三文鱼；连续两天偏辣，建议明晚选择清淡汤菜。</p>
      </div>

      <div class="meal-plan">
        ${renderMealBlock("早餐", selected.meals.breakfast)}
        ${renderMealBlock("午餐", selected.meals.lunch)}
        ${renderMealBlock("晚餐", selected.meals.dinner)}
      </div>
    </section>
  `;
}

function renderMealBlock(label, items) {
  return `
    <article class="meal-block">
      <div class="meal-heading">
        <h3>${label}</h3>
        <span>${items.length ? `${items.length} 道` : "未安排"}</span>
      </div>
      <div class="meal-items">
        ${items.length ? items.map(name => `<span class="meal-item">${name}</span>`).join("") : `
          <button class="meal-empty" type="button" onclick="fillEmptyMeal('${label}')">${icon("plus")}还没安排，点我添加</button>
        `}
      </div>
    </article>
  `;
}

function renderGrocery() {
  const groups = ["蔬菜", "肉蛋", "水产", "调味品", "主食", "其他"];
  const visibleGroups = groups.map(group => ({
    name: group,
    items: state.groceries.filter(item => item.category === group)
  })).filter(group => group.items.length);

  return `
    <section class="screen grocery-screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">自动汇总缺少食材</p>
          <h1 class="title">采购清单</h1>
        </div>
        <button class="round-icon-btn" type="button" onclick="clearPurchased()" aria-label="清空已购买">${icon("check")}</button>
      </header>

      ${visibleGroups.length ? visibleGroups.map(renderGroceryGroup).join("") : renderEmpty("grocery", "采购清单已清空", "今天的菜单暂时不缺食材，可以安心做饭。")}
      <div class="bottom-copy">
        <button class="copy-btn" type="button" onclick="copyGroceryList()">${icon("copy")}复制清单</button>
      </div>
    </section>
  `;
}

function renderGroceryGroup(group) {
  return `
    <section class="grocery-group">
      <div class="group-title">
        <h3>${group.name}</h3>
        <span>${group.items.length} 项</span>
      </div>
      <div class="grocery-list">
        ${group.items.map(item => `
          <article class="grocery-item ${item.checked ? "checked" : ""}">
            <button class="check-btn" type="button" onclick="toggleGrocery('${item.id}')" aria-label="${item.checked ? "取消勾选" : "标记已购买"}">${icon("check")}</button>
            <div>
              <p class="grocery-name">${item.name}</p>
              <p class="grocery-source">来自：${item.source.join("、")}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMine() {
  return `
    <section class="screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">家庭偏好</p>
          <h1 class="title">我的</h1>
          <p class="subtitle">这里保留家庭成员口味、库存偏好和后续设置入口。</p>
        </div>
      </header>

      <section class="profile-card">
        <h3>家庭成员</h3>
        <p>默认三人家庭，可在后续真实项目里改成可编辑成员。</p>
        <div class="member-grid">
          <div class="member-row"><strong>我</strong><span>少辣 · 喜欢鱼类</span></div>
          <div class="member-row"><strong>伴侣</strong><span>多菜少肉 · 汤可以多一点</span></div>
          <div class="member-row"><strong>小朋友</strong><span>不吃太辣 · 喜欢鸡翅和粥</span></div>
        </div>
      </section>

      <section class="profile-card">
        <h3>库存提醒</h3>
        <p>常备：鸡蛋、面条、紫菜、生抽、姜蒜。低库存：绿叶菜、鱼类、排骨。</p>
      </section>

      <section class="profile-card">
        <h3>数据同步</h3>
        <p>${state.syncStatus}。菜谱、菜单和采购清单会在设备之间保持一致。</p>
      </section>
    </section>
  `;
}

function renderEmpty(iconName, title, description) {
  return `
    <div class="empty-state">
      <div class="empty-box">
        ${icon(iconName === "search" ? "search" : iconName === "grocery" ? "grocery" : "today")}
        <strong>${title}</strong>
        <p>${description}</p>
      </div>
    </div>
  `;
}

function renderBottomNav() {
  const items = [
    ["today", "today", "今日"],
    ["recipes", "book", "菜谱"],
    ["week", "week", "一周"],
    ["grocery", "grocery", "采购"],
    ["mine", "user", "我的"]
  ];
  const active = ["detail", "add"].includes(state.page) ? "recipes" : state.page;

  return `
    <nav class="bottom-nav" aria-label="底部导航">
      ${items.map(([page, iconName, label]) => `
        <button class="nav-item ${active === page ? "active" : ""}" type="button" onclick="navigate('${page}')" aria-label="${label}">
          ${icon(iconName)}
          <span>${label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function navigate(page) {
  state.page = page;
  render();
}

function goRecipes() {
  state.page = "recipes";
  render();
}

function openAddDish() {
  state.addForm = createDefaultAddForm();
  state.page = "add";
  render();
}

function addDishToToday(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return false;
  if (!state.selectedToday.includes(recipeId)) {
    state.selectedToday.push(recipeId);
    return true;
  }
  return false;
}

function handleRecipeCardKey(event, recipeId) {
  if (event.target.closest("button")) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openRecipe(recipeId);
}

function quickAddToToday(event, recipeId) {
  event.stopPropagation();
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  const added = addDishToToday(recipeId);
  render();
  showToast(added ? `${recipe.name} 已加入今日已选菜单` : `${recipe.name} 已在今日菜单里`);
}

function addRecipeIngredients(recipeId, shouldToast = true) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  recipe.buy.forEach(name => {
    const existing = state.groceries.find(item => item.name === name);
    if (existing) {
      if (!existing.source.includes(recipe.name)) existing.source.push(recipe.name);
      existing.checked = false;
    } else {
      state.groceries.push({
        id: `g${Date.now()}${Math.random().toString(16).slice(2)}`,
        category: inferGroceryCategory(name),
        name,
        source: [recipe.name],
        checked: false
      });
    }
  });
  if (shouldToast) showToast(`已加入 ${recipe.name} 的缺少食材`);
}

function inferGroceryCategory(name) {
  if (["鸡翅中", "排骨", "牛腩", "鸡蛋"].some(word => name.includes(word))) return "肉蛋";
  if (["三文鱼", "虾皮"].some(word => name.includes(word))) return "水产";
  if (["可乐", "生抽", "蚝油", "柠檬"].some(word => name.includes(word))) return "调味品";
  if (["小米", "面条", "小葱"].some(word => name.includes(word))) return "主食";
  if (["番茄", "西兰花", "生菜", "冬瓜", "土豆", "胡萝卜", "南瓜"].some(word => name.includes(word))) return "蔬菜";
  return "其他";
}

function setSearch(value) {
  state.query = value;
  render();
}

function setCategory(category) {
  state.category = category;
  render();
}

function openRecipe(id) {
  state.selectedRecipeId = id;
  state.page = "detail";
  render();
}

function updateAddField(field, value) {
  state.addForm[field] = value;
  if (field === "name" && value.trim()) state.addForm.errors.name = false;
  state.addForm.saved = false;
}

function toggleAddCategory(category) {
  const list = state.addForm.categories;
  if (list.includes(category)) {
    state.addForm.categories = list.filter(item => item !== category);
  } else {
    state.addForm.categories = [...list, category];
  }
  state.addForm.saved = false;
  render();
}

function toggleAddTag(tag) {
  const list = state.addForm.tags;
  if (list.includes(tag)) {
    state.addForm.tags = list.filter(item => item !== tag);
  } else {
    state.addForm.tags = [...list, tag];
  }
  state.addForm.saved = false;
  render();
}

function adjustAddTime(field, delta) {
  const current = state.addForm[field];
  state.addForm[field] = Math.min(180, Math.max(1, current + delta));
  state.addForm.saved = false;
  render();
}

function setAddDifficulty(level) {
  state.addForm.difficulty = level;
  state.addForm.saved = false;
  render();
}

function updateIngredient(type, index, field, value) {
  state.addForm[type][index][field] = value;
  state.addForm.saved = false;
}

function addIngredient(type) {
  state.addForm[type].push({ name: "", amount: "" });
  state.addForm.saved = false;
  render();
}

function removeIngredient(type, index) {
  state.addForm[type].splice(index, 1);
  state.addForm.saved = false;
  render();
}

function updateStep(index, value) {
  state.addForm.steps[index] = value;
  state.addForm.saved = false;
}

function addStep() {
  state.addForm.steps.push("");
  state.addForm.saved = false;
  render();
}

function removeStep(index) {
  state.addForm.steps.splice(index, 1);
  state.addForm.saved = false;
  render();
}

function setPreference(member, value) {
  state.addForm.preferences[member] = value;
  state.addForm.saved = false;
  render();
}

function toggleAddToggle(key) {
  state.addForm.toggles[key] = !state.addForm.toggles[key];
  state.addForm.saved = false;
  render();
}

function cleanIngredientList(list) {
  return list
    .map(item => ({ name: item.name.trim(), amount: item.amount.trim() }))
    .filter(item => item.name);
}

function saveDraft() {
  state.addForm.errors = {};
  state.addForm.saved = false;
  render();
  const name = state.addForm.name.trim();
  showToast(name ? `${name} 草稿已保存` : "草稿已保存，稍后继续补全");
}

function saveNewDish() {
  const form = state.addForm;
  const name = form.name.trim();

  if (!name) {
    form.errors = { name: true };
    render();
    showToast("先填菜名，再保存菜品");
    return;
  }

  if (form.saving) return;
  form.saving = true;
  form.saved = false;
  render();
  showToast("正在保存菜品");

  window.setTimeout(() => {
    const recipe = createRecipeFromForm(form);
    recipes.unshift(recipe);
    state.selectedRecipeId = recipe.id;
    state.category = "全部";
    state.query = "";
    state.addForm = createDefaultAddForm();
    state.addForm.saved = true;
    state.addForm.lastSavedName = recipe.name;
    state.page = "add";
    render();
    showToast(`${recipe.name} 已加入菜谱库`);
  }, 650);
}

function createRecipeFromForm(form) {
  const pantry = cleanIngredientList(form.pantry);
  const buy = cleanIngredientList(form.buy);
  const ingredients = [...new Set([...pantry, ...buy].map(item => item.name))];
  const tags = [...form.tags];
  if (form.toggles.lessSpicy && !tags.includes("少辣")) tags.push("少辣");
  if (form.toggles.moreVeg && !tags.includes("多菜少肉")) tags.push("多菜少肉");

  return {
    id: `custom-${Date.now().toString(36)}`,
    name: form.name.trim(),
    categories: form.categories.length ? [...form.categories] : ["快手菜"],
    ingredients: ingredients.length ? ingredients : ["按家里库存搭配"],
    pantry: pantry.map(item => item.name),
    buy: buy.map(item => item.name),
    prep: form.prep,
    cook: form.cook,
    time: form.prep + form.cook,
    difficulty: form.difficulty,
    flavor: tags.includes("清淡") || form.toggles.lessSpicy ? "清淡" : "家常",
    spice: form.toggles.lessSpicy ? "少辣" : "按家里口味",
    tags: tags.length ? tags : ["家常"],
    likes: { ...form.preferences },
    steps: form.steps.map(step => step.trim()).filter(Boolean).length
      ? form.steps.map(step => step.trim()).filter(Boolean)
      : ["处理主要食材。", "按家里习惯的顺序下锅。", "出锅前试味并微调。"],
    favorite: false,
    recent: "刚刚新增",
    notThisWeek: true
  };
}

function toggleFavorite(event, id) {
  event.stopPropagation();
  const recipe = recipeById(id);
  recipe.favorite = !recipe.favorite;
  render();
  showToast(recipe.favorite ? "已收藏到家庭常做菜" : "已取消收藏");
}

function addToToday(recipeId) {
  const recipe = recipeById(recipeId);
  const added = addDishToToday(recipeId);
  state.page = "today";
  render();
  showToast(added ? `${recipe.name} 已加入今日已选菜单` : `${recipe.name} 已在今日菜单里`);
}

function removeTodayDish(recipeId) {
  const recipe = recipeById(recipeId);
  state.selectedToday = state.selectedToday.filter(id => id !== recipeId);
  render();
  showToast(recipe ? `已从今日菜单移除 ${recipe.name}` : "已从今日菜单移除");
}

function addSelectedTodayToGrocery() {
  const selected = selectedTodayRecipes();
  if (!selected.length) {
    showToast("先选好今天要吃的菜");
    return;
  }
  selected.forEach(recipe => addRecipeIngredients(recipe.id, false));
  render();
  showToast("已按今日已选菜单补充采购清单");
}

function addRecipeToGrocery(recipeId) {
  addRecipeIngredients(recipeId, true);
  render();
}

function createWeekPlan() {
  return Array.from({ length: 7 }, (_, index) => {
    const parts = getTodayParts(index);
    const preset = [
      { breakfast: ["小米粥"], lunch: ["番茄炒蛋", "清炒西兰花"], dinner: ["可乐鸡翅", "紫菜蛋花汤", "葱油拌面"] },
      { breakfast: [], lunch: ["葱油拌面"], dinner: ["香煎三文鱼", "蒜蓉生菜"] },
      { breakfast: ["小米粥"], lunch: [], dinner: ["冬瓜排骨汤", "番茄炒蛋"] },
      { breakfast: [], lunch: ["清炒西兰花", "紫菜蛋花汤"], dinner: [] },
      { breakfast: ["小米粥"], lunch: ["可乐鸡翅"], dinner: ["土豆炖牛腩", "蒜蓉生菜"] },
      { breakfast: [], lunch: [], dinner: ["香煎三文鱼", "紫菜蛋花汤"] },
      { breakfast: ["小米粥"], lunch: ["葱油拌面"], dinner: [] }
    ][index];

    return { ...parts, meals: preset };
  });
}

function selectWeekDay(index) {
  state.selectedDay = index;
  render();
}

function autoGenerateWeek() {
  weekPlan = createWeekPlan().map((day, index) => ({
    ...day,
    meals: {
      breakfast: day.meals.breakfast.length ? day.meals.breakfast : ["小米粥"],
      lunch: day.meals.lunch.length ? day.meals.lunch : [["番茄炒蛋", "蒜蓉生菜"], ["葱油拌面", "紫菜蛋花汤"]][index % 2],
      dinner: day.meals.dinner.length ? day.meals.dinner : [["香煎三文鱼", "清炒西兰花"], ["冬瓜排骨汤", "番茄炒蛋"]][index % 2]
    }
  }));
  render();
  showToast("已自动补齐未来 7 天菜单");
}

function fillEmptyMeal(label) {
  const day = weekPlan[state.selectedDay];
  const key = label === "早餐" ? "breakfast" : label === "午餐" ? "lunch" : "dinner";
  day.meals[key] = label === "早餐" ? ["小米粥"] : label === "午餐" ? ["番茄炒蛋", "蒜蓉生菜"] : ["香煎三文鱼", "紫菜蛋花汤"];
  render();
  showToast(`${label}已添加一组家常搭配`);
}

function toggleGrocery(id) {
  const item = state.groceries.find(entry => entry.id === id);
  if (!item) return;
  item.checked = !item.checked;
  render();
}

function clearPurchased() {
  const before = state.groceries.length;
  state.groceries = state.groceries.filter(item => !item.checked);
  render();
  showToast(before === state.groceries.length ? "还没有勾选已购买食材" : "已清空勾选的食材");
}

async function copyGroceryList() {
  const text = state.groceries
    .filter(item => !item.checked)
    .map(item => `${item.category}：${item.name}（${item.source.join("、")}）`)
    .join("\n");

  if (!text) {
    showToast("没有需要复制的未购买食材");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("采购清单已复制");
  } catch {
    showToast("浏览器限制了复制，可手动选择清单内容");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function initializeLoveMenu() {
  render();
  await hydratePersistentState();
  state.loading = false;
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLoveMenu, { once: true });
} else {
  initializeLoveMenu();
}
