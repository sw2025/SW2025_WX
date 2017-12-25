// pages/account/account.js
Page({
  data: {
    typename: '',
  },
  /**开通会员 */
  openMember: function () {
    if (this.data.enterp !== "3") {
      wx.showModal({
        title: '提示',
        content: '请您先进行企业认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../enterprise/enterprise',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../member/member',
      })
    }
  },
  /**提现 */
  cashTap: function () {
    if (this.data.exp !== "2") {
      wx.showModal({
        title: '提示',
        content: '请您先进行专家认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../expert/expert',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../cash/cash',
      })
    }
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
      exp: options.exp,
      enterp: options.enterp,
    })
    console.log(options)
  },
  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/getEnterAccount?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        switch (res.data.return_code) {
          case 200:
            var result = res.data.data[0];
            var captions = result.eventcount;
            if (result.eventcounts == '无限') {
              captions = '无限'
            }
            that.setData({
              typename: result.typename,
              consultcount: result.consultcount,
              eventcount: captions,
            })
            break;
          case 401:
            that.setData({
              typename: '非会员',
              consultcount: 0,
              eventcount: 0,
            })
            break;
          case 403:
            that.setData({
              typename: '非会员',
              consultcount: 0,
              eventcount: 0,
            })
            break;
          default:
            break;
        }
        // if (res.data.return_code == 401 || res.data.return_code == 403) {
        //   that.setData({
        //     typename: '非会员',
        //     consultcount: 0,
        //     eventcount: 0,
        //   })
        // } else if (res.data.return_code == 200) {
        //   var result = res.data.data[0];
        //   that.setData({
        //     typename: result.typename,
        //     consultcount: result.consultcount,
        //     eventcount: result.eventcount,
        //   })
        // }
      }
    })
  },
})