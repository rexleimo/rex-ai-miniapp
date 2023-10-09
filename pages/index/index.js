const {
  APIURI
} = require("../../utils/config")

// index.js
Page({
  data: {
    prompt: "",
    negative_prompt: "",
    huamianIdx: -1,
    typeIdx: 0,
    styleIdx: 0,
    attrIdx: {},
    types: [],
    styles: [],
    attrs: [],
    huamian: [{
      value: 0,
      name: "1:1"
    }, {
      value: 1,
      name: "6:9"
    }, {
      value: 2,
      name: "9:6"
    }],
    respImages: [],
    progress: 0,
    isRendererMode: false
  },
  onLoad() {
    const than = this
    wx.request({
      url: `${APIURI}category`,
      success: function (resp) {
        const {
          data
        } = resp;
        const {
          data: list
        } = data;
        than.setData({
          types: list
        })
        const shift = list[0];
        wx.request({
          url: `${APIURI}category?pid=${shift.id}`,
          success: function (resp) {
            const {
              data
            } = resp;
            const {
              data: list
            } = data;
            than.setData({
              styles: list
            })
            const shift = list[0];
            than.getAllAttrs(shift.id);
          }
        })
      }
    })

    wx.login({
      success: (res) => {
        const {
          code
        } = res;
        wx.request({
          url: `${APIURI}miniapp/open_id?code=${code}`,
          success: res => {
            const {
              data
            } = res.data
            wx.setStorageSync('token', data)
          }
        })
      },
    })
  },
  getAllAttrs(cid) {
    const than = this;
    wx.request({
      url: `${APIURI}category/attr/${cid}`,
      success: function (resp) {
        const {
          data
        } = resp;
        const {
          data: list
        } = data;
        than.setData({
          attrs: list
        })
      }
    })
  },
  getWidthAndHeight(value) {
    switch (value) {
      case 0:
        return {
          width: 1024, height: 1024
        }
        case 1:
          return {
            width: 1024, height: 2048
          }
          case 2:
            return {
              width: 2048, height: 1024
            }
    }
  },
  getRendererProgress() {
    const than = this;
    wx.request({
      url: `${APIURI}sd/progress`,
      success: function (resp) {
        const {
          data
        } = resp;
        const {
          progress
        } = data;
        const progress100 = Math.floor(progress * 100)
        than.setData({
          progress: progress100
        })
        if (progress100 !== 0) {
          setTimeout(() => {
            than.getRendererProgress()
          }, 500);
        } else {
          than.setData({
            isRendererMode: false
          })
        }
      }
    })
  },
  getStyleTarget() {
    const {
      styles,
      styleIdx
    } = this.data
    return styles[styleIdx]
  },
  handleChangeTap: function (e) {
    const {
      idx,
      cloumname
    } = e.currentTarget.dataset;
    this.setData({
      [cloumname]: idx
    })
    if (cloumname === "styleIdx") {
      this.getAllAttrs(this.data.styles[idx].id)
    }
  },
  handleChangeAttrTap: function (e) {
    const {
      idx,
      cloumname
    } = e.currentTarget.dataset;
    const attrIdx = {
      ...this.data.attrIdx
    };
    attrIdx[cloumname] = idx;
    this.setData({
      attrIdx
    })
  },
  handleRenderImage() {
    const {
      negative_prompt,
      huamianIdx,
      isRendererMode,
      attrIdx,
      attrs
    } = this.data;
    let {
      prompt
    } = this.data;
    if (isRendererMode) return;

    const getTypes = () => {
      const {
        types,
        typeIdx
      } = this.data
      return types[typeIdx]
    }

    const getCurAttr = (name) => {
      return attrs.find(v => v.name === name);
    }
    prompt += `${getTypes().en_name} ,`;
    prompt += `${this.getStyleTarget().en_name} ,`;
    for (const key of Object.keys(attrIdx)) {
      const cur = getCurAttr(key)
      const value = cur.values[attrIdx[key]];
      prompt += `${cur.en_name} ${value.en_name}, `;
    }
    const getWidthAndHeight = this.getWidthAndHeight
    const than = this;
    wx.request({
      url: `${APIURI}sd/text2img?cid=${this.getStyleTarget().id}`,
      method: "POST",
      data: {
        prompt,
        negative_prompt,
        ...getWidthAndHeight(huamianIdx)
      },
      timeout: 60 * 1000 * 3,
      header: {
        "Authorization": `Bearer ${wx.getStorageSync('token')}`
      },
      success: function (resp) {
        const {
          data,
        } = resp;
        const {
          images,
          error
        } = data;

        if (error) {
          wx.showToast({
            title: error,
            icon: "error",
            duration: 2000
          })
          return
        }

        than.setData({
          respImages: images
        })

      },
      fail: function () {},
    })
    than.setData({
      isRendererMode: true
    })
    setTimeout(() => {
      than.getRendererProgress()
    }, 500);
  }
})