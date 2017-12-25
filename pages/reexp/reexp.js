// pages/reenter/reenter.js
Page({
  data: {
    expert: '',
    state: '',
    src: '',
    btnHtml: '',
    bgcolor: '',
    reason:''
  },
  reVerify: function () {
    if (this.data.state !== '正在审核...') {
      wx.navigateTo({
        url: '../expert/expert',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://api.sw2025.com/api/authMe?token=' + token,
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var Lists = res.data[0].expert[0];
        switch (res.data[0].expert[0].configid) {
          case 1:
            that.data.state = '正在审核...'
            that.data.src = '../images/checking.png'
            that.data.btnHtml = '正在审核'
            that.data.bgcolor = 'gray'
            that.data.reason = ''
            break;
          case 3:
            that.data.state = '审核未通过'
            that.data.src = '../images/failure.png'
            that.data.btnHtml = '重新提交'
            that.data.bgcolor = 'red-btn'
            that.data.reason = 'show'
            break;
          default:
            that.data.state = '认证成功'
            that.data.src = '../images/success.png'
            that.data.btnHtml = '重新审核'
            that.data.bgcolor = 'red-btn'
            that.data.reason = ''
            break;
        }
        that.setData({
          expert: Lists,
          state: that.data.state,
          src: that.data.src,
          btnHtml: that.data.btnHtml,
          bgcolor: that.data.bgcolor,
          reason: that.data.reason,
          
        })
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
})