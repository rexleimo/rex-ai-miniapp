const { APIURI } = require("../../utils/config")
const dayjs = require('dayjs')

// pages/task/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tasks: []
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
        wx.request({
            url: `${APIURI}task`,
            header: {
                Authorization: `Bearer ${wx.getStorageSync('token')}`
            },
            success: (resp) => {
                const { data: tasks } = resp.data
                Array.from(tasks).forEach(v => {
                    v.create_at = dayjs(v.create_at).format("YYYY-MM-DD HH:mm")
                    if (v.images) {
                        v.images = v.images?.map((img) => `${APIURI}${img}`)
                    }
                })
                this.setData({
                    tasks
                })
            }
        })
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

    }
})