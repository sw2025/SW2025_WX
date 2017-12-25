var app = getApp()
Page({
  data: {
    phone: null,
    password: null,
    dataInfo: null
  },
  phonenumerInput: function (e) {
    this.data.phone = e.detail.value
  },
  passwordInput: function (e) {
    this.data.password = e.detail.value
  },
  loginButtonClick: function () {
    var that = this
    var requestData =
      {
        phone: this.data.phone,
        password: this.data.password
      }
    //正则判断
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入有效的手机号码！',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: 'https://api.sw2025.com/api/user/login',
      data: requestData,
      method: 'POST',
      success: function (res) {
        that.setData({ dataInfo: res.data })
        switch (that.data.dataInfo.data[0].return_code) {
          case 200:
            //登录成功
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            try {
              wx.setStorageSync('token', that.data.dataInfo.data[0].return_data)
              wx.setStorageSync('isLogin', true)
            } catch (e) {}
            // app.globalData.token = that.data.dataInfo.data[0].return_data
            wx.navigateTo({
              url: '../swindex/swindex?currentTab=0' // 回退前 delta(默认为1) 页面
            })
            break
          case 401:
            wx.showToast({
              title: '参数错误',
              duration: 2000
            })
            break
          case 402:
            wx.showToast({
              title: '该手机号尚未注册',
              duration: 2000
            })
            break
          case 403:
            wx.showToast({
              title: '账号被冻结',
              duration: 2000
            })
            break
          case 404 :
            wx.showToast({
              title: '用户名或密码错误',
              duration: 2000
            })
            break
          default:
            wx.showToast({
              title: '服务器异常，请稍后再试',
              duration: 2000
            })
            break
        }
      },
    })
  },
  registButtonClick: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})