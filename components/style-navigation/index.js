// components/style_list.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    styles: {
      type: Array,
      value: []
    },
    styleIdx: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function (e) {
      const {
        idx
      } = e.currentTarget.dataset;
      this.triggerEvent('tapidx', {
        idx
      })
    }
  }
})