// pages/match/match.js
const app = getApp();
Page({
  data: {
    list: [],
    pushexp: '',
    select: "0",
    counts: 0,
    multiArray: [],
    objectMultiArray: [],
    multiIndex: [0, 0],
    show: true,
    startPage: 1,
    isloading: true,//为true时刷新，false加载
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      show: false,
      multiIndex: e.detail.value
    })
    this.data.isloading = true;
    this.reqData();
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = wx.getStorageSync('array0');
            break;
          case 1:
            data.multiArray[1] = wx.getStorageSync('array1');
            break;
          case 2:
            data.multiArray[1] = wx.getStorageSync('array2');
            break;
          case 3:
            data.multiArray[1] = wx.getStorageSync('array3');
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  checkboxChange: function (e) {
    console.log(e)
    if (e.detail.value.length > 5) {
      wx.showToast({
        title: '最多可选5位专家',
        duration: 3000
      })
      return;
    }
    this.setData({
      arr: e.detail.value,
      pushexp: e.detail.value.join(','),
      counts: e.detail.value.length,
    })
    wx.setStorageSync('count', this.data.counts)
    console.log(e.detail.value.length)
    console.log('checkbox发生change事件，携带value值为：', this.data.pushexp)
  },
  onLoad: function () {
    this.data.isloading = true
    this.reqData();//首屏执行获取数据
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.data.isloading = true
    this.reqData()
  },
  //上拉加载
  onReachBottom: function () {
    this.data.isloading = false
    this.reqData()
  },

  // 获取专家数据
  reqData: function () {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var domain1 = '';
    var domain2 = '';
    switch (that.data.multiIndex[0]) {
      case 0:
        domain1 = wx.getStorageSync('navbar')[0]
        domain2 = wx.getStorageSync('array0')[that.data.multiIndex[1]]
        break;
      case 1:
        domain1 = wx.getStorageSync('navbar')[1]
        domain2 = wx.getStorageSync('array1')[that.data.multiIndex[1]]
        break;
      case 2:
        domain1 = wx.getStorageSync('navbar')[2]
        domain2 = wx.getStorageSync('array2')[that.data.multiIndex[1]]
        break;
      case 3:
        domain1 = wx.getStorageSync('navbar')[3]
        domain2 = wx.getStorageSync('array3')[that.data.multiIndex[1]]
        break;
    }
    var datas = {};
    if (that.data.isloading) {
      that.data.startpage = 1;
      that.data.list = [];
    } else {
      that.data.startpage += 1;
    }
    if (that.data.show === false) {
      datas = {
        startPage: that.data.startpage,
        pageCount: 16,
        type01: domain1,
        type02: domain2,
      }
    } else {
      datas = {
        startPage: that.data.startpage,
        pageCount: 16
      }
    }
    var url = 'https://api.sw2025.com/api/expert/myexpert?token=' + wx.getStorageSync('token')
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: datas,
      success: function (res) {
        console.log(res.data)
        var lists = res.data.data;
        that.data.list = that.data.list.concat(lists)
        wx.hideToast()
        that.setData({
          list: that.data.list,
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
    var nav = wx.getStorageSync('navbar')
    var jun0 = wx.getStorageSync('array0')

    var navs = this.circle(nav)
    var json0 = this.circle(jun0)
    this.setData({
      objectMultiArray: [navs, json0],
      multiArray: [nav, jun0]
    })
    // console.log(this.data.objectMultiArray)
    // console.log(this.data.multiArray)
  },
  // 点击完成提交
  bindFormSubmit: function (e) {
    if (this.data.pushexp == '') {
      this.setData({
        select: '0'
      })
    } else {
      this.setData({
        select: '1'
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        data: {
          pushexp: this.data.pushexp,
          select: this.data.select,
        }
      })
    }
    wx.setStorageSync('pushexp', this.data.pushexp)
    wx.setStorageSync('select', this.data.select)
    wx.navigateBack();
    console.log(this.data.select)
  },
  circle: function (e) {
    var zero = '';
    var json = null;
    for (var i = 0; i < e.length; i++) {
      if (i == e.length - 1) {
        zero = zero + '{ "id":' + i + ', "name":' + '"' + e[i] + '"' + '}'
      } else {
        zero = zero + '{ "id":' + i + ', "name":' + '"' + e[i] + '"' + '},'
      }
    }
    var arrayJson = "[" + zero + "]";
    json = JSON.parse(arrayJson);
    return json;
  },
  // 取消
  cacelTap: function () {
    wx.navigateBack({})
  }
})