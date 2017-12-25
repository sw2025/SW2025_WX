// pages/cash/cash.js
Page({
  data: {
    result: '',
    src: '',
  },
  /**添加银行卡 */
  addCard: function () {
    wx.navigateTo({
      url: '../addcard/addcard?account='
      + this.data.result.account
      + '&bankcard=' + this.data.result.bankcard
      + '&bankname=' + this.data.result.bankname
      + '&bankfullname=' + this.data.result.bankfullname
    })
  },
  /**全部提现 */
  allCash: function () {
    this.setData({
      inpValue: this.data.balance
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inpValue: e.detail.value
    })
  },
  /**提现 */
  apply: function () {
    var that = this;
    if (that.data.result == '' || that.data.result == null){
      wx.showModal({
        title: '提示',
        content: '请您先添加银行卡',
        showCancel: false,
      })
    }else{
      if (that.data.inpValue == 0 || that.data.inpValue == '0.00'){
        wx.showModal({
          title: '提示',
          content: '余额不可用',
          showCancel: false,
        })
      } else if (that.data.inpValue == undefined){
        wx.showModal({
          title: '提示',
          content: '请输入提现金额',
        })
      }
      else{
        that.applyCash();
      }
    }
  },
  /**关于提现方法 */
  applyCash:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/withdrawals?token=' + token;
    var datas = {
      amount: that.data.inpValue
    }
    wx.request({
      url: url,
      method: 'POST',
      data: datas,
      success: function (res) {
        switch (res.data.return_code) {
          case "200":
            wx.showModal({
              title: '提示',
              content: '提现成功',
              showCancel: false,
            })
            break;
          case "401":
            // wx.showModal({
            //   title: '提示',
            //   content: '请输入提现金额',
            // })
            break;
          case "404":
            wx.showModal({
              title: '提示',
              content: '余额不足',
            })
            break;
          case "403":
            wx.showModal({
              title: '提示',
              content: '个人数据异常',
            })
            break;
          case "402":
            wx.showModal({
              title: '提示',
              content: '参数非法',
            })
            break;
          default:
            break;
        }
      }
    })
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },
  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/getBankCard?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        var result = res.data.data[0];
        console.log(that.data.result)
        if (res.data.return_code == 200) {
          that.setData({
            src: '../images/card.png',
            result: result,
            bankname: result.bankname,
            bankcard: '尾号 ' + result.bankcard.slice(-4) + ' 储蓄卡'
          })
        } else if (res.data.return_code == 402) {
          that.setData({
            src: '../images/addcard.png',
            bankname: '未添加银行卡',
            bankcard: '去添加'
          })
        }
      }
    })
    /**判断余额与输入值 */
    // if(parseFloat(that.data.balance) < that.data.enterVal)
    that.remain()
  },
  /**余额 */
  remain: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/getAccount?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        if (res.data.return_code == 200) {
          if (res.data.balance !== null) {
            that.setData({
              balance: res.data.balance,
            })
          } else {
            that.setData({
              balance: "0.00",
            })
          }
        }
      }
    })
  },
})