// pages/addopinion/addopinion.js
Page({
  data: {
    str: '',
    epid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      epid: options.epid,
      role: options.role
    })
  },
  bindconfirm: function (e) {
    this.data.str = e.detail.value;
  },
  cacelTap: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '请输入您的意见！',
        icon: 'success',
        duration: 2000
      })
    } else {
      var url = 'https://api.sw2025.com/api/eventMark?token=' + wx.getStorageSync('token');
      var datas = {
        epid: that.data.epid,
        content: e.detail.value.textarea,
        role: that.data.role
      }
      wx.request({
        url: url,
        method: 'POST',
        data: datas,
        success: function (res) {
          console.log(res.data)
          wx.showModal({
            title: '提示',
            content: '发表意见成功',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        }
      })
    }
  },
 
})