// pages/history/history.js
var app = getApp()
Page({
  data: {
    list:[],
    domain1: "",
    domain2: "",
    time: "",
    brief:"",
    name:'',
    hidden: true,//为true时隐藏，false显示
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.reqData();//首屏执行获取数据
  },
  // 加载数据
  reqData: function () {
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var datas = {
      domain1: _this.data.domain1,
      domain2: _this.data.domain2,
      time: _this.data.created_at,
      brief: _this.data.brief,
      name:_this.data.name
    }
    _this.data.url = 'https://api.sw2025.com/api/event/myevent?token=' + wx.getStorageSync('token')
    wx.request({
      url: _this.data.url, //仅为示例，并非真实的接口地址
      data: datas,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideToast()
        console.log(res.data)
        _this.data.list = res.data.data
        if (_this.data.list.length == 0){
          _this.setData({
            hidden: false
          })
        }else{
          _this.setData({
            list: _this.data.list,
            hidden: true
          })
        }
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reqData();
  },
})