// index.js
Page({
  data: {
    prompt: "",
    styleIdx: 0,
    styleItemIdx: 0,
    styles: [{
      conver: "http://localhost:7100/public/sd_block/20230928/1695883013415.png",
      name: "好的"
    }],
    grids2: [{
      conver: "http://localhost:7100/public/sd_block/20230928/1695883013415.png",
      name: "好的"
    }, ],
    huamian: [{
      value: 0,
      name: "1:1"
    }, {
      value: 1,
      name: "6:9"
    }, {
      value: 2,
      name: "9:6"
    }]
  },
  handleStyleTap: function (e) {
    const {
      idx
    } = e.detail;
    this.setData({
      styleIdx: idx
    })
  },
  handleStyleItemTap: function (e) {
    const {
      idx
    } = e.detail;
    this.setData({
      styleItemIdx: idx
    })
  }
})