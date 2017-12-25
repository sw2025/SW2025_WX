var app = getApp();
Page({
  data: {
    dataInfo: null,
    phone: null,
    verifycode: null,
    password: null,
    roles: ['专家', '企业'],
    role:'',
    index: 0,
    second: 60,
    before: false,
    after: true
  },
  phonenumerInput: function (e) {
    this.data.phone = e.detail.value
  },
  smscodeInput: function (e) {
    this.data.verifycode = e.detail.value
  },
  passwordInput: function (e) {
    this.data.password = e.detail.value
  },
  // 下拉选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  vcode: function () {
    //正则判断
    var that = this
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入有效的手机号码！',
        duration: 2000
      })
      return false;
    }
    var requestData = {
      phone: this.data.phone,
      action: 'register'
    }
    wx.request({
      url: 'https://api.sw2025.com/api/user/getSmsCode',
      data: requestData,
      method: 'POST',
      success: function (res) {
        that.setData({
          dataInfo: res.data
        })
        console.log(that.data.dataInfo)
        switch (that.data.dataInfo.data[0].return_code) {
          case "200":
            wx.showToast({
              title: '验证码发送成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              before: true,
              after: false
            })
            countdown(that);
            break;
          case "401":
            wx.showToast({
              title: '参数错误',
              duration: 2000
            })
            break;
          case "404":
            wx.showToast({
              title: '该账号被冻结',
              duration: 2000
            })
            break;
          case "405":
            wx.showToast({
              title: '该账号已注册',
              duration: 2000
            })
            break;
          case "406":
            wx.showToast({
              title: '该账号未注册',
              duration: 2000
            })
            break;
          default:
            wx.showToast({
              title: '服务器异常',
              duration: 2000
            })
            break
        }
      },
    })
  },
  registButtonClick: function () {
    var that = this
    switch (this.data.index) {
      case "0":
        this.data.role = 'expert'
        break;
      case "1":
        this.data.role = 'enterprise'
        break;
      default:
        this.data.role = 'expert'
        break ;
    }
    var requestData = {
      phone: this.data.phone,
      password: this.data.password,
      verifycode: this.data.verifycode,
      role: this.data.role,
      action: 'register'
    }

    console.log(this.data.role);
    //正则判断
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入有效的手机号码！',
        duration: 2000
      })
      return false;
    }
    if (this.data.verifycode == null) {
      wx.showToast({
        title: '请输入验证码',
        duration: 2000
      })
      return false;
    }
    if (this.data.password == null) {
      wx.showToast({
        title: '请输入密码',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: 'https://api.sw2025.com/api/user/register',
      data: requestData,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        that.setData({
          dataInfo: res.data
        })
        switch (that.data.dataInfo.data[0].return_code) {
          case 200:
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            })
            try {
              wx.setStorageSync('token', that.data.dataInfo.data[0].return_data)
              wx.setStorageSync('isLogin', true)
            } catch (e) { }
            // app.globalData.token = that.data.dataInfo.data[0].return_data
            wx.redirectTo({
              url: '../swindex/swindex?currentTab=0'
            })
            break;
          case 401:
            wx.showToast({
              title: '参数错误',
              duration: 2000
            })
            break;
          case 402:
            wx.showToast({
              title: '验证码不正确',
              duration: 2000
            })
            break;
          case 403:
            wx.showToast({
              title: '该账号已注册',
              duration: 2000
            })
            break;
          case 404:
            wx.showToast({
              title: '服务器错误',
              duration: 2000
            })
            break;
          case 405:
            wx.showToast({
              title: '账号未注册',
              duration: 2000
            })
            break;
          case 407:
            wx.showToast({
              title: 'action参数错误',
              duration: 2000
            })
            break;
          default:
            wx.showToast({
              title: '服务器异常',
              duration: 2000
            })
            break
        }
      }
    })
  }
})
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      before: false,
      after: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}