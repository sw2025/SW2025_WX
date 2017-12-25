// pages/counts/counts.js
Page({
  data: {
    val: 1,
    sum: 80,
    total:80,
  },
  bindKeyInput: function (e) {
    var total = (e.detail.value * 80);
    var sum = (e.detail.value * 80).toFixed(2);
    this.setData({
      val: e.detail.value,
      total:total,
      sum: sum
    })
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sum: this.data.sum.toFixed(2),
      total:this.data.total,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  payConfirm: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: function (loginCode) {
        var appid = 'wxc0a43ee610dbd582';
        var secret = 'b7a1b7d8f71547b58c360d0c57569cc7';
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.request({
              // url: 'https://api.sw2025.com/api/wechat/pay?token=' + token + '&amount=1' + '&payType=payMoney',
              url: 'https://api.sw2025.com/api/wechat/pay?token=' + token + '&amount=' + that.data.total +'&payType=payMoney',
              data: {
                openid: res.data.openid,
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data.data)
                var data = JSON.parse(res.data.data)
                console.log(JSON.parse(res.data.data))
                var orderNumber = res.data.ordernumber
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function (res) {
                    wx.request({
                      url: 'https://api.sw2025.com/api/wechat/webhooks?token=' + token + '&ordernumber=' + orderNumber + '&package=' + data.package,
                      data: {
                        'payType': 'payMoney',
                        'type': 'event',
                        'eventCount': that.data.val,
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        wx.showModal({
                          title: '提示',
                          content: '支付成功',
                          showCancel:false,
                          success:function(res){
                            if(res.confirm){
                              wx.navigateBack({})
                            }
                          }
                        })
                      }
                    })
                  }
                });
              }
            })
          }
        })
      }
    })
  },
})