const test = require("node:test");
const assert = require("node:assert/strict");
const appConfig = require("../miniprogram/app.json");
const { TAB_ITEMS, selectTab } = require("../miniprogram/utils/tab-bar");

test("自定义菜单与小程序注册的四个 Tab 完全一致", () => {
  const customItems = TAB_ITEMS.map((item) => ({
    pagePath: item.pagePath.slice(1),
    text: item.text,
    iconPath: item.iconPath.slice(1),
    selectedIconPath: item.selectedIconPath.slice(1)
  }));
  assert.deepEqual(customItems, appConfig.tabBar.list);
});

test("页面显示时同步自定义菜单的选中项", () => {
  const updates = [];
  const tabBar = {
    data: { selected: 1 },
    setData(data) {
      updates.push(data);
      Object.assign(this.data, data);
    }
  };
  const page = { getTabBar: () => tabBar };

  selectTab(page, 3);
  assert.deepEqual(updates, [{ selected: 3 }]);
  assert.equal(tabBar.data.selected, 3);

  selectTab(page, 3);
  assert.equal(updates.length, 1);
});

test("原生菜单环境下同步函数安全跳过", () => {
  assert.doesNotThrow(() => selectTab({}, 0));
  assert.doesNotThrow(() => selectTab({ getTabBar: () => null }, 0));
});
