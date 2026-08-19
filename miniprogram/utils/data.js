const { buildWeekPlan } = require("./domain");

const recipes = [
  {
    id: "tomato-egg", name: "番茄炒蛋", categories: ["快手菜"],
    ingredients: ["番茄", "鸡蛋", "小葱"], pantry: ["鸡蛋", "小葱", "盐"], buy: ["番茄"],
    prep: 5, cook: 7, time: 12, difficulty: "简单", flavor: "清淡", spice: "不辣",
    tags: ["快手", "下饭", "适合晚餐"], likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "喜欢" },
    steps: ["番茄去蒂切块，鸡蛋加少量盐打散。", "热锅滑蛋至刚凝固，盛出备用。", "番茄炒出汁后回锅鸡蛋，轻轻翻匀。"],
    favorite: true, recent: "3 天前"
  },
  {
    id: "broccoli", name: "清炒西兰花", categories: ["素菜", "快手菜"],
    ingredients: ["西兰花", "蒜", "橄榄油"], pantry: ["蒜", "盐", "橄榄油"], buy: ["西兰花"],
    prep: 6, cook: 6, time: 12, difficulty: "简单", flavor: "清爽", spice: "不辣",
    tags: ["多菜少肉", "清淡", "快手"], likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "一般" },
    steps: ["西兰花掰小朵，淡盐水浸泡后焯 40 秒。", "蒜片小火煸香，放入西兰花。", "少量盐调味，保持脆口即可出锅。"],
    favorite: false, recent: "5 天前"
  },
  {
    id: "cola-wings", name: "可乐鸡翅", categories: ["荤菜"],
    ingredients: ["鸡翅中", "可乐", "姜"], pantry: ["姜", "生抽", "老抽"], buy: ["鸡翅中", "可乐"],
    prep: 8, cook: 22, time: 30, difficulty: "普通", flavor: "微甜", spice: "不辣",
    tags: ["小朋友喜欢", "周末", "下饭"], likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "喜欢" },
    steps: ["鸡翅划两刀，冷水下锅焯去浮沫。", "煎至两面微黄，加入姜片、生抽和可乐。", "中小火收汁，汤汁能挂住鸡翅即可。"],
    favorite: true, recent: "上周"
  },
  {
    id: "seaweed-soup", name: "紫菜蛋花汤", categories: ["汤", "快手菜"],
    ingredients: ["紫菜", "鸡蛋", "虾皮"], pantry: ["紫菜", "鸡蛋", "香油"], buy: ["虾皮"],
    prep: 3, cook: 5, time: 8, difficulty: "简单", flavor: "清淡", spice: "不辣",
    tags: ["快手汤", "清淡", "早餐也可"], likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "喜欢" },
    steps: ["清水煮开后放入紫菜和虾皮。", "鸡蛋液细细淋入锅中形成蛋花。", "关火后滴香油，按口味加盐。"],
    favorite: true, recent: "昨天"
  },
  {
    id: "beef-potato", name: "土豆炖牛腩", categories: ["荤菜"],
    ingredients: ["牛腩", "土豆", "胡萝卜"], pantry: ["八角", "生抽", "姜"], buy: ["牛腩", "土豆", "胡萝卜"],
    prep: 15, cook: 70, time: 85, difficulty: "进阶", flavor: "浓郁", spice: "微辣可选",
    tags: ["周末", "耐心菜", "适合晚餐"], likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "一般" },
    steps: ["牛腩焯水后冲净，土豆和胡萝卜切大块。", "牛腩与香料煸香，加热水炖至软烂。", "加入土豆胡萝卜再炖 20 分钟。"],
    favorite: false, recent: "半个月前"
  },
  {
    id: "lettuce", name: "蒜蓉生菜", categories: ["素菜", "快手菜"],
    ingredients: ["生菜", "蒜", "蚝油"], pantry: ["蒜", "蚝油"], buy: ["生菜"],
    prep: 4, cook: 4, time: 8, difficulty: "简单", flavor: "清爽", spice: "不辣",
    tags: ["多菜少肉", "快手", "清淡"], likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "不爱吃" },
    steps: ["生菜洗净沥干，蒜切末。", "蒜末小火炒香，加入少量蚝油和水。", "放入生菜快速翻匀，断生即出锅。"],
    favorite: false, recent: "4 天前"
  },
  {
    id: "salmon", name: "香煎三文鱼", categories: ["荤菜", "快手菜"],
    ingredients: ["三文鱼", "柠檬", "黑胡椒"], pantry: ["黑胡椒", "海盐", "橄榄油"], buy: ["三文鱼", "柠檬"],
    prep: 5, cook: 9, time: 14, difficulty: "普通", flavor: "鲜香", spice: "不辣",
    tags: ["少辣", "鱼类", "轻晚餐"], likes: { "我": "喜欢", "伴侣": "喜欢", "小朋友": "一般" },
    steps: ["三文鱼擦干，两面撒海盐和黑胡椒。", "中火先煎鱼皮面，至边缘变色。", "翻面再煎 2 分钟，挤少量柠檬汁。"],
    favorite: true, recent: "两周前"
  },
  {
    id: "scallion-noodle", name: "葱油拌面", categories: ["主食", "快手菜"],
    ingredients: ["面条", "小葱", "生抽"], pantry: ["面条", "生抽", "白糖"], buy: ["小葱"],
    prep: 5, cook: 10, time: 15, difficulty: "简单", flavor: "咸香", spice: "不辣",
    tags: ["快手主食", "宵夜", "少洗碗"], likes: { "我": "喜欢", "伴侣": "一般", "小朋友": "喜欢" },
    steps: ["小葱切段，小火炸至边缘微焦。", "生抽、老抽、少量糖调成酱汁。", "面条煮熟拌入葱油和酱汁。"],
    favorite: true, recent: "6 天前"
  }
];

const groceries = [
  { id: "g1", category: "蔬菜", name: "西兰花", source: ["清炒西兰花"], checked: false },
  { id: "g2", category: "蔬菜", name: "番茄", source: ["番茄炒蛋"], checked: true },
  { id: "g3", category: "肉蛋", name: "鸡翅中", source: ["可乐鸡翅"], checked: false },
  { id: "g4", category: "水产", name: "三文鱼", source: ["香煎三文鱼"], checked: false },
  { id: "g5", category: "调味品", name: "可乐", source: ["可乐鸡翅"], checked: false }
];

function createInitialState() {
  const clonedRecipes = JSON.parse(JSON.stringify(recipes));
  return {
    version: 2,
    recipes: clonedRecipes,
    groceries: JSON.parse(JSON.stringify(groceries)),
    selectedToday: [],
    weekPlan: buildWeekPlan(clonedRecipes)
  };
}

module.exports = { createInitialState };
