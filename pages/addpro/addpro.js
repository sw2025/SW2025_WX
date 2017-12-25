// pages/addpro/addpro.js
Page({
  data: {
    str: '',
    epid: '',
  },

  /**生命周期函数--监听页面加载**/
  onLoad: function (options) {
    this.setData({
      epid: options.epid
    })
  },
  bindconfirm: function (e) {
    this.data.str = e.detail.value;
  },
  bindFormSubmit: function (e) {
    var that = this;
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '请输入描述！',
        icon: 'success',
        duration: 2000
      })
    } else {
      var url = 'https://api.sw2025.com/api/publishDaily?token=' + wx.getStorageSync('token');
      var datas = {
        epid: that.data.epid,
        taskname: e.detail.value.textarea,
      }
      wx.request({
        url: url,
        method: 'POST',
        data:datas,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data.return_code == 200){
            wx.setStorageSync("eps", that.data.epid)
            wx.navigateBack({
              // url:'../process/process?epid='+that.data.epid
            })
          }
        }
      })
    }
  },
  cacelTap: function () {
    wx.navigateBack({})
  }
})