// pages/recdetails/recdetails.js
Page({
  data: {
    eventid: "",
    btnShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    // this.data.btnShow = wx.getStorageSync('btnToggle');
    console.log(options)
    this.data.eventid = options.eventid;
    that.setData({
      showimage: options.showimage,
      enterprisename: options.enterprisename,
      domain1: options.domain1,
      responsetime: options.responsetime,
      brief: options.brief,
      domain2: options.domain2,
      state: options.state,
    })
    if(that.data.state == '1'){
      that.setData({
        btnShow: false,
      })
    }else{
      that.setData({
        btnShow: true,
      })
    }
  },

  //改变响应状态
  response: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '您确定响应吗？',
      success: function (res) {
        if (res.confirm) {
          var datas = {
            eventid: _this.data.eventid
          }
          var url = 'https://api.sw2025.com/api/s2_event_changeState?token=' + wx.getStorageSync('token')
          wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: datas,
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideToast()
              switch (res.data.return_code) {
                case "200":
                  wx.showModal({
                    title: '提示',
                    content: '响应成功',
                    showCancel: false,
                    success: function (res) {
                      wx.navigateBack({
                        // url:wx.getStorageSync('myeveUrl'),
                        url: '../recommend/recommend'
                      });
                    }
                  })
                  break;
                default:
                  break;
              }
            },
          })
        } else if (res.cancel) {
          console.log('取消响应')
        }
      }
    })
  }
})