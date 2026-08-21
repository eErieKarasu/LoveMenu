const { TAB_ITEMS } = require("../utils/tab-bar");

Component({
  data: {
    selected: 0,
    locked: false,
    list: TAB_ITEMS
  },

  methods: {
    switchTab(event) {
      if (this.data.locked) return;
      const selected = Number(event.currentTarget.dataset.index);
      const pagePath = event.currentTarget.dataset.path;
      if (selected === this.data.selected) return;
      const previous = this.data.selected;
      this.setData({ selected });
      wx.switchTab({
        url: pagePath,
        fail: () => this.setData({ selected: previous })
      });
    }
  }
});
