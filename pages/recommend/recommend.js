// pages/recommend/recommend.js
var app = getApp()
Page({
  data: {
    tabArr: ['推送列表', '我的办事'],
    junArr: ['已响应', '已受邀', '已完成'],
    list: [],
    hidden: true,//为true时隐藏，false显示
    currentTab: 0,
    crt1: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // onLoad: function () {
  //   this.reqData(0);//首屏执行获取数据
  // },
  onShow: function (options) {
    if (this.data.currentTab == 0){
      this.reqData(0);
    }else{
      this.reqData(1);
    }
  },
  // 列表导航
  navbarTap: function (e) {
    this.data.currentTab = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (0 == e.currentTarget.dataset.idx) {
      this.reqData(0);
    } else if (1 == e.currentTarget.dataset.idx) {
      this.reqData(1);
    }
  },
  // 我的办事二次导航
  juniorTap: function (e) {
    this.data.crt1 = (e.currentTarget.dataset.idx + 2);
    this.setData({
      crt: e.currentTarget.dataset.idx
    })
    this.reqData(1);
  },
  // 加载推送列表数据
  reqData: function (e) {
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    if (0 == e) {
      _this.data.url = 'https://api.sw2025.com/api/s2_event_pushEvent?token=' + wx.getStorageSync('token')
    } else if (1 == e) {
      _this.data.url = 'https://api.sw2025.com/api/s2_event_MyEvent?token=' + wx.getStorageSync('token')
    }
    
    wx.request({
      url: _this.data.url, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        step: _this.data.crt1,
      },
      success: function (res) {
        console.log(res.data)
        wx.hideToast()
        // wx.stopPullDownRefresh()
        _this.data.list = res.data.data
        if (_this.data.list.length == 0) {
          _this.setData({
            list: [],
            hidden: false
          })
        } else {
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
  jump: function (event) {
    var states = event.currentTarget.dataset.ben.state;
    var eventid = event.currentTarget.dataset.ben.eventid;
    var showimage = event.currentTarget.dataset.ben.showimage;
    var enterprisename = event.currentTarget.dataset.ben.enterprisename;
    var domain1 = event.currentTarget.dataset.ben.domain1;
    var responsetime = event.currentTarget.dataset.ben.responsetime;
    var brief = event.currentTarget.dataset.ben.brief;
    var domain2 = event.currentTarget.dataset.ben.domain2;
    // if (states == "0") {
    //   wx.setStorageSync('btnToggle', false)
    // } else {
    //   wx.setStorageSync('btnToggle', true)
    // }
    if (states == 3){
      wx.navigateTo({
        url: '../expwork/expwork?eventid=' + eventid,
      })
    }else{
    wx.navigateTo({
      url: '../recdetails/recdetails?showimage=' + showimage
      + '&eventid=' + eventid
      + '&enterprisename=' + enterprisename
      + '&domain1=' + domain1
      + '&responsetime=' + responsetime
      + '&brief=' + brief
      + '&domain2=' + domain2
      + '&state=' + states
    })
    }
  }
})