var app = getApp()
Page({
  data: {
    nickname: null
  },
  usernameInput: function (e) {
    this.data.nickname = e.detail.value
  },
  sureButtonClick: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var datas = {
      name: that.data.nickname
    }
    if (token) {
      wx.request({
        url: 'https://api.sw2025.com/api/changeNickName?token=' + token,
        method: 'POST',
        data: datas,
        success: function (res) {
          console.log(res.data)
          switch (res.data.return_code) {
            case "200":
              wx.showModal({
                title: '提示',
                content: '修改昵称成功',
                showCancel: false,
                success: function (res) {
                  wx.navigateBack();
                }
              })
              break;
            case "401":
              wx.showModal({
                title: '提示',
                content: '昵称不能为空',
                showCancel: false,
              })
              break;
            case "402":
              wx.showModal({
                title: '提示',
                content: '昵称不能与之前相同',
                showCancel: false,
              })
              break;
          }
        },
      })
    }
  },
})