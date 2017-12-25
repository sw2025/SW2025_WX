// pages/addcard/addcard.js
Page({
  data: {

  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    if (options.bankcard == "undefined" || options.bankcard == undefined) {
      this.setData({
        name: null,
        bankNumber: null,
        bankName: null,
        bankSecondName: null,
        buttonTxt: '添加银行卡'
      })
    } else {
      this.setData({
        name: options.account,
        bankNumber: options.bankcard,
        bankName: options.bankname,
        bankSecondName: options.bankfullname,
        buttonTxt: '修改银行卡'
      })
    }
  },
  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },
  formSubmit: function (e) {
    var result = e.detail.value;
    console.log(e.detail.value)
    var auth = true;
    for (var i in result) {
      var obj = result[i];
      if (obj == "" || obj == null) {
        wx.showModal({
          title: '提示',
          content: '请您将信息填写完整',
        })
        auth = false;
        return;
      }
    };
    var that = this;
    var token = wx.getStorageSync('token');
    var name = result.name;
    var bankNumber = result.bankNumber;
    var bankName = result.bankName;
    var bankSecondName = result.bankSecondName;
    var url = 'https://api.sw2025.com/api/addBankCard?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        name: name,
        bankNumber: bankNumber,
        bankName: bankName,
        bankSecondName: bankSecondName
      },
      success: function (res) {
        if (res.data.return_code == 200) {
          wx.navigateBack({})
        }
      }
    })
  },

})