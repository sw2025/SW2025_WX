// pages/member/member.js
Page({
  data: {
    list: [],
    currentTab: 0,
    amount: '',
    payType: 'member',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/chargeAmount?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        if (res.data.return_code == 200) {
          that.setData({
            list: res.data.data,
            amount: res.data.data[0].amount,
            desc: res.data.data[0].desc,
          })
        }
      }
    })
  },
  levelTap: function (e) {
    if (this.data.payType == 'payMoney') {
      return;
    } else {
      this.data.currentTab = e.currentTarget.dataset.idx;
      var myamount = this.data.list[this.data.currentTab].amount;
      var mydesc = this.data.list[this.data.currentTab].desc;
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
        amount: myamount,
        desc: mydesc,
      })
    }
  },
  /**会员or充值 */
  radioChange: function (e) {
    this.setData({
      payType: e.detail.value
    })
    if (e.detail.value == 'payMoney') {
      this.setData({
        amount: 120,
      })
    } else {
      this.setData({
        amount: this.data.list[this.data.currentTab].amount,
      })
    }
  },
  


  payConfirm: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(that.data.list[that.data.currentTab].id)
    wx.login({
      success: function (loginCode) {
        var appid = 'wxc0a43ee610dbd582';
        var secret = 'b7a1b7d8f71547b58c360d0c57569cc7';
        wx.request({
          //url: 'http://sw.zerdream.com/api/chargeNumber' ,
          url: 'https://api.sw2025.com/api/chargeNumber' ,

          data: {
            appid: 'wxc0a43ee610dbd582',
            secret: 'b7a1b7d8f71547b58c360d0c57569cc7',
            grant_type: 'authorization_code',
            js_code: loginCode.code,
          },
          method:'POST' ,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var ben = JSON.parse(res.data.data); 
            console.log(ben);
            
            switch (that.data.payType) {
              case 'member':
                var urls = 'https://api.sw2025.com/api/wechat/pay?token=' + token + '&memberId=' + that.data.list[that.data.currentTab].id;
                break;
              case 'payMoney':
                var urls = 'https://api.sw2025.com/api/wechat/pay?token=' + token + '&amount=120';
                break;
              default:
                break;
            }
            wx.request({
              url: urls,
              data: {
                openid: ben.openid,
                payType: that.data.payType,
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data)
                var data = JSON.parse(res.data.data)
                console.log(JSON.parse(res.data.data))
                var orderNumber = res.data.ordernumber
                switch (that.data.payType) {
                  case 'member':
                    var datas = {
                      'payType': 'member',
                      'memberId': that.data.list[that.data.currentTab].id,
                    };
                    break;
                  case 'payMoney':
                    var datas = {
                      'payType': 'payMoney',
                      'type': 'event',
                      'eventCount': 1,
                    };
                    break;
                  default:
                    break;
                }
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function (res) {
                    wx.request({
                      url: 'https://api.sw2025.com/api/wechat/webhooks?token=' + token + '&ordernumber=' + orderNumber + '&package=' + data.package,
                      method: 'POST',
                      data: datas,
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        wx.showToast({
                          title: '支付成功',
                          duration: 4000,
                          success: function (res) {
                            wx.navigateBack({
                            })
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