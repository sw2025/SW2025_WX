// pages/accountdet/accountdet.js
Page({
  data: {
    list:[],
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/accountDetails?token=' + token;
    wx.request({
      url: url,
      method: 'POST',
      success: function(res){
        if(res.data.return_code == 200){
          if (res.data.balance.length == 0){
            wx.showModal({
              title: '温馨提示',
              content: '暂无相关数据',
              showCancel : false ,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            that.setData({
              list: res.data.balance
            })
          }
        }
      }
    })
  },
  /*** 生命周期函数--监听页面显示 */
  onShow: function () {
  
  },
})