const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createMenuSnapshot,
  decodeMenuSnapshot,
  encodeMenuSnapshot,
  menuShareTitle
} = require("../miniprogram/utils/share-menu");

test("今日菜单快照可以完整编解码", () => {
  const snapshot = createMenuSnapshot("9月22日 周二", "2026-09-22", [
    { key: "breakfast", label: "早餐", dishes: [] },
    { key: "lunch", label: "午餐", dishes: [{ name: "番茄炒蛋", time: 15 }] },
    { key: "dinner", label: "晚餐", dishes: [{ name: "可乐鸡翅", time: 30 }] }
  ]);
  assert.deepEqual(decodeMenuSnapshot(encodeMenuSnapshot(snapshot)), snapshot);
  assert.equal(menuShareTitle(snapshot), "今天吃番茄炒蛋、可乐鸡翅");
});

test("菜单快照会限制字段长度并拒绝无效数据", () => {
  const snapshot = createMenuSnapshot("今天", "2026-09-22", [{
    key: "dinner",
    label: "晚餐",
    dishes: Array.from({ length: 10 }, (_, index) => ({ name: `菜 ${index}`, time: 999 }))
  }]);
  assert.equal(snapshot.meals[0].dishes.length, 4);
  assert.equal(snapshot.meals[0].totalCount, 10);
  assert.equal(snapshot.meals[0].dishes[0].time, 360);
  assert.equal(decodeMenuSnapshot("not-json"), null);
});
