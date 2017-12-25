// pages/expdetails/expdetails.js
Page({
  data: {
    Object: '',
    money:'',
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var datas = {}
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/expert/myexpertdetail?token=' + token + '&expertid=' + options.id
    wx.request({
      url: url,
      method: 'POST',
      data: datas,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.data.Object = res.data.data;
        console.log(that.data.Object)
        if (that.data.Object.fee == '0'){
          that.setData({
            money: '免费',
          })
        }else{
          that.setData({
            money: that.data.Object.fee+' 元',
          })
        }
        that.setData({
          Object: that.data.Object,
          time: that.data.Object.verifytime.slice(0,10)
        });
      }
    })
  },
  
})