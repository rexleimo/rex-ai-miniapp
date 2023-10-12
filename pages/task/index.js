const {
  APIURI
} = require("../../utils/config")
const dayjs = require('dayjs')

// pages/task/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
    pageSize: 10,
    pageNum: 1,
    noMor: false,
    showMask: false,
    maskUri: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      pageNum: 1,
      pageSize: 10,
      tasks: []
    })
    setTimeout(() => {
      this.getFetchList();
      setTimeout(() => {
        this.getUpdateTaskInfo();
      }, 375);
    }, 0);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getFetchList() {
    wx.request({
      url: `${APIURI}task?pageSize=${this.data.pageSize}&page=${this.data.pageNum}`,
      header: {
        Authorization: `Bearer ${wx.getStorageSync('token')}`
      },
      success: (resp) => {
        const {
          data: tasks
        } = resp.data
        Array.from(tasks).forEach(v => {
          v.create_at = dayjs(v.create_at).format("yyyy/MM/dd HH:mm:ss")
          if (v.images) {
            v.images = v.images?.map((img) => `${APIURI}${img}`)
          }
        })
        this.setData({
          tasks: [...this.data.tasks, ...tasks],
          noMor: !(this.data.pageSize === tasks.length)
        })
      }
    })
  },
  getUpdateTaskInfo() {
    const shouldIds = this.data.tasks.filter(v => v.status === 0).map(v => v.id);

    wx.request({
      url: `${APIURI}task/ids`,
      header: {
        "Authorization": `Bearer ${wx.getStorageSync('token')}`
      },
      method: "POST",
      data: {
        task_ids: shouldIds
      },
      success: resp => {
        const {
          data
        } = resp.data;
        if (data) {
          const tasks = Array.from(this.data.tasks);
          for (const v of data) {
            const idx = tasks.findIndex(t => t.id == v.id);
            if (idx > -1) {
              if (v.status == 200) {
                v.images = v.images.map(img => `${APIURI}${img}`)
              }
              tasks[idx] = v;
            }
          }
          console.log(tasks)
          this.setData({
            tasks
          })
          const statusIsNormol = data.filter(v => v.status === 0);
          if (statusIsNormol.length > 0) {
            setTimeout(() => {
              this.getUpdateTaskInfo();
            }, 10000);
          }
        }
      }
    })

  },
  handleSaveImage(e) {
    const {
      id
    } = e.currentTarget.dataset
    const saveFileToPhotosAlbum = () => {
      const info = this.data.tasks.find(v => v.id === id);
      if (info) {
        wx.downloadFile({
          url: info.images[0],
          success: (resp) => {
            wx.saveImageToPhotosAlbum({
              filePath: resp.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        })
      }
    }
    wx.getSetting({
      success: (setting) => {
        if (!setting.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              saveFileToPhotosAlbum()
            }
          })
        } else {
          saveFileToPhotosAlbum()
        }
      }
    })
  },
  handleGetMoreList() {
    if (this.data.pageNum * this.data.pageSize === this.data.tasks.length) {
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      setTimeout(() => {
        this.getFetchList();
      }, 0);
    }
  },
  handleShowMaskZoomIn(e) {
    const {
      uri
    } = e.currentTarget.dataset
    if (uri) {
      this.setData({
        showMask: true,
        maskUri: uri,
      })
    }
  },
  handleCloseMask() {
    this.setData({
      showMask: false
    })
  }
})