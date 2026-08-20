const TAB_ITEMS = [
  {
    pagePath: "/pages/today/index",
    text: "今日",
    iconPath: "/assets/tabs/v2/today.png",
    selectedIconPath: "/assets/tabs/v2/today-active.png"
  },
  {
    pagePath: "/pages/recipes/index",
    text: "菜谱",
    iconPath: "/assets/tabs/v2/recipes.png",
    selectedIconPath: "/assets/tabs/v2/recipes-active.png"
  },
  {
    pagePath: "/pages/grocery/index",
    text: "采购",
    iconPath: "/assets/tabs/v2/grocery.png",
    selectedIconPath: "/assets/tabs/v2/grocery-active.png"
  },
  {
    pagePath: "/pages/inventory/index",
    text: "库存",
    iconPath: "/assets/tabs/v2/inventory.png",
    selectedIconPath: "/assets/tabs/v2/inventory-active.png"
  }
];

function selectTab(page, selected) {
  if (!page || typeof page.getTabBar !== "function") return;
  const tabBar = page.getTabBar();
  if (tabBar && tabBar.data.selected !== selected) tabBar.setData({ selected });
}

module.exports = { TAB_ITEMS, selectTab };
