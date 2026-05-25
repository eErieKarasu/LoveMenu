const categories = ["全部", "荤菜", "素菜", "汤", "主食", "早餐", "快手菜"];

const recipes = [
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

const menuSets = [
  {
    label: "今晚推荐",
    dishes: ["cola-wings", "broccoli", "seaweed-soup", "scallion-noodle"]
  },
  {
    label: "清淡一点",
    dishes: ["salmon", "lettuce", "wintermelon-soup", "millet"]
  },
  {
    label: "周末耐心菜",
    dishes: ["beef-potato", "lettuce", "seaweed-soup", "scallion-noodle"]
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

const state = {
  page: "today",
  category: "全部",
  query: "",
  menuIndex: 0,
  selectedRecipeId: "tomato-egg",
  selectedDay: 0,
  groceries: grocerySeed.map(item => ({ ...item, source: [...item.source] })),
  loading: true,
  toastTimer: null
};

let weekPlan = createWeekPlan();

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
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
  app.innerHTML = `${renderCurrentPage()}${renderBottomNav()}`;
}

function renderCurrentPage() {
  if (state.loading) return renderLoading();
  if (state.page === "today") return renderToday();
  if (state.page === "recipes") return renderRecipes();
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
  const menu = menuSets[state.menuIndex];
  const menuRecipes = menu.dishes.map(recipeById);
  const recent = recipes.filter(recipe => !recipe.notThisWeek).slice(0, 5);
  const missing = recipes.filter(recipe => recipe.notThisWeek).slice(0, 5);

  return `
    <section class="screen">
      <header class="screen-header">
        <div class="header-stack">
          <p class="eyebrow">${today.label} · ${currentPeriod()}</p>
          <h1 class="title">今晚吃点什么？</h1>
          <p class="subtitle">打开就能看到今日组合，也能按家里库存快速换一组。</p>
        </div>
        <button class="round-icon-btn" type="button" onclick="changeMenu()" aria-label="换一组菜单">${icon("refresh")}</button>
      </header>

      <section class="hero-card">
        <div class="hero-topline">
          <span class="meal-period">${icon("today")}${menu.label}</span>
          <span class="date-note">4 道菜 · 约 45 分钟</span>
        </div>
        <div class="menu-grid">
          ${menuRecipes.map((recipe, index) => renderMenuDish(recipe, index)).join("")}
        </div>
        <div class="action-row">
          <button class="secondary-btn" type="button" onclick="changeMenu()">${icon("refresh")}换一组菜单</button>
          <button class="primary-btn" type="button" onclick="addMenuToGrocery()">${icon("grocery")}加入采购清单</button>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">最近常吃</h2>
        <div class="horizontal-list">
          ${recent.map(recipe => renderMiniDish(recipe)).join("")}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">本周还没吃过</h2>
        <div class="horizontal-list">
          ${missing.map(recipe => renderMiniDish(recipe)).join("")}
        </div>
      </section>
    </section>
  `;
}

function renderMenuDish(recipe, index) {
  const marks = ["", "sage", "blue", "rose"];
  const role = ["主菜", "素菜", "汤", "主食"][index] || "菜品";
  return `
    <article class="menu-dish">
      <div class="dish-mark ${marks[index] || ""}">${icon(index === 2 ? "today" : index === 1 ? "leaf" : "star")}</div>
      <div>
        <p class="dish-name">${role} · ${recipe.name}</p>
        <div class="dish-meta">
          <span class="pill">${icon("clock")}${recipe.time} 分钟</span>
          <span class="pill blue">${recipe.flavor}</span>
          ${spicePill(recipe)}
        </div>
      </div>
    </article>
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
      ` : renderEmpty("search", "没有找到合适的菜", "换个关键词，或者点右下角新增一道家里常做菜。")}

      <button class="fab" type="button" onclick="showToast('新增菜品入口已预留，后续可接入真实表单')" aria-label="新增菜品">${icon("plus")}</button>
    </section>
  `;
}

function renderRecipeCard(recipe) {
  const likeText = Object.entries(recipe.likes).map(([member, value]) => `${member}${value}`).join(" · ");
  return `
    <button class="recipe-card" type="button" onclick="openRecipe('${recipe.id}')">
      <div>
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
      <div class="chevron-cell">
        <span class="favorite-btn ${recipe.favorite ? "active" : ""}" onclick="toggleFavorite(event, '${recipe.id}')" aria-label="收藏状态">${icon("heart")}</span>
        ${icon("chevron")}
      </div>
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
        <h3>轻提示示例</h3>
        <p>点击任意菜单按钮会出现 Toast，用于反馈换菜单、加入采购清单、复制清单等轻操作。</p>
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
  const active = state.page === "detail" ? "recipes" : state.page;

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

function changeMenu() {
  state.menuIndex = (state.menuIndex + 1) % menuSets.length;
  render();
  showToast("已换成另一组更适合今天的菜单");
}

function addMenuToGrocery() {
  const menu = menuSets[state.menuIndex];
  menu.dishes.forEach(id => addRecipeIngredients(id, false));
  render();
  showToast("已按今日菜单补充采购清单");
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

function toggleFavorite(event, id) {
  event.stopPropagation();
  const recipe = recipeById(id);
  recipe.favorite = !recipe.favorite;
  render();
  showToast(recipe.favorite ? "已收藏到家庭常做菜" : "已取消收藏");
}

function addToToday(recipeId) {
  const recipe = recipeById(recipeId);
  showToast(`${recipe.name} 已加入今日菜单`);
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

document.addEventListener("DOMContentLoaded", () => {
  render();
  window.setTimeout(() => {
    state.loading = false;
    render();
  }, 520);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
});
