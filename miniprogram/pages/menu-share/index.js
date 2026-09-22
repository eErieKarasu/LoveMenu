const { decodeMenuSnapshot, encodeMenuSnapshot, menuShareTitle } = require("../../utils/share-menu");

Page({
  data: {
    invalid: false,
    snapshot: null,
    selectedCount: 0,
    totalTime: 0
  },

  onLoad(options) {
    const snapshot = decodeMenuSnapshot(options && options.menu);
    if (!snapshot) {
      this.setData({ invalid: true });
      return;
    }
    this.sharePath = `/pages/menu-share/index?menu=${encodeMenuSnapshot(snapshot)}`;
    this.setData({
      snapshot,
      selectedCount: snapshot.meals.reduce((sum, meal) => sum + meal.totalCount, 0),
      totalTime: snapshot.meals.reduce((sum, meal) => sum + meal.totalTime, 0)
    });
  },

  openApp() {
    wx.switchTab({ url: "/pages/today/index" });
  },

  onShareAppMessage() {
    if (!this.data.snapshot) return { title: "大王今天的饭", path: "/pages/today/index" };
    return { title: menuShareTitle(this.data.snapshot), path: this.sharePath };
  },

  onShareTimeline() {
    if (!this.data.snapshot) return { title: "大王今天的饭" };
    return {
      title: menuShareTitle(this.data.snapshot),
      query: `menu=${encodeMenuSnapshot(this.data.snapshot)}`
    };
  }
});
