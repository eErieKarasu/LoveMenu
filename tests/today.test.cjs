const test = require("node:test");
const assert = require("node:assert/strict");
const { recentDescription, recentRecipeCard, recentStatus } = require("../miniprogram/utils/today");

test("最近做过状态会补充完整语义且不重复", () => {
  assert.equal(recentStatus("刚刚"), "刚刚做过");
  assert.equal(recentStatus("昨天做过"), "昨天做过");
  assert.equal(recentStatus(""), "最近做过");
});

test("最近常做卡片保留真实菜谱封面并生成简介", () => {
  const card = recentRecipeCard({
    id: "tomato-eggs",
    name: "番茄炒蛋",
    image: "cloud://demo/tomato-eggs.jpg",
    recent: "刚刚",
    flavor: "酸甜",
    tags: ["快手菜"]
  });
  assert.equal(card.imageSrc, "cloud://demo/tomato-eggs.jpg");
  assert.equal(card.statusText, "刚刚做过");
  assert.equal(card.descriptionText, "酸甜开胃，家人都爱吃。");
  assert.equal(recentDescription({ description: "自己的家常做法。" }), "自己的家常做法。");
});
