// pages/recharge/recharge.js
Page({
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.redirectTo({
      url: '../swindex/swindex?currentTab=0',
    })
  },
})