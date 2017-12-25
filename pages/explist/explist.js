// pages/explist/explist.js
var app = getApp();
Page({
  data: {
    navbar: [],
    arr: [],
    array0: [],
    array1: [],
    array2: [],
    array3: [],
    senior: [],
    junior0: [],
    junior1: [],
    junior2: [],
    junior3: [],
    currentTab: 0,
    goods: '',
    finds: '',
  },
  tabTap: function (e) {
    console.log(e.currentTarget.dataset.idx)
    this.data.currentTab = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.goods = e.detail.value
  },
  // 点击完成提交
  bindFormSubmit: function (e) {
    console.log(this.data.finds)
    switch (this.data.currentTab) {
      case 0:
        this.data.finds = this.data.senior[0];
        break;
      case 1:
        this.data.finds = this.data.senior[1];
        break;
      case 2:
        this.data.finds = this.data.senior[2];
        break;
      case 3:
        this.data.finds = this.data.senior[3];
        break;
      default:
        break;
    }
    if (this.data.goods == '') {
      wx.showToast({
        title: '请选择擅长问题',
        icon: 'success',
        duration: 2000
      })
    } else {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        data: {
          goods: this.data.goods,
          finds: this.data.finds,
        }
      })
      wx.setStorageSync('goods', this.data.goods)
      wx.setStorageSync('finds', this.data.finds)
      wx.navigateBack();
    }
  },
  onLoad: function (options) {
    var that = this;
    if (!wx.getStorageSync('navbar')) {
      wx.request({
        url: 'https://api.sw2025.com/api/eventType',
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          that.setData({
            arr: res.data.data,
          })
          for (var i = 0; i < that.data.arr.length; i++) {
            var opt = that.data.arr[i].domainname;
            that.data.navbar.push(opt);
          }
          for (var j = 0; j < that.data.arr[0].benben.length; j++) {
            var optChild = that.data.arr[0].benben[j].domainname;
            that.data.array0.push(optChild);
          }
          for (var j = 0; j < that.data.arr[1].benben.length; j++) {
            var optChild = that.data.arr[1].benben[j].domainname;
            that.data.array1.push(optChild);
          }
          for (var j = 0; j < that.data.arr[2].benben.length; j++) {
            var optChild = that.data.arr[2].benben[j].domainname;
            that.data.array2.push(optChild);
          }
          for (var j = 0; j < that.data.arr[3].benben.length; j++) {
            var optChild = that.data.arr[3].benben[j].domainname;
            that.data.array3.push(optChild);
          }
          wx.setStorageSync('navbar', that.data.navbar);
          wx.setStorageSync('array0', that.data.array0);
          wx.setStorageSync('array1', that.data.array1);
          wx.setStorageSync('array2', that.data.array2);
          wx.setStorageSync('array3', that.data.array3);
          var jun0 = wx.getStorageSync('array0')
          var jun1 = wx.getStorageSync('array1')
          var jun2 = wx.getStorageSync('array2')
          var jun3 = wx.getStorageSync('array3')
          var json0 = that.circle(jun0)
          var json1 = that.circle(jun1)
          var json2 = that.circle(jun2)
          var json3 = that.circle(jun3)
          that.setData({
            senior: wx.getStorageSync('navbar'),
            junior0: json0,
            junior1: json1,
            junior2: json2,
            junior3: json3
          })
        }
      })
    } else {
      var jun0 = wx.getStorageSync('array0')
      var jun1 = wx.getStorageSync('array1')
      var jun2 = wx.getStorageSync('array2')
      var jun3 = wx.getStorageSync('array3')

      var json0 = this.circle(jun0)
      var json1 = this.circle(jun1)
      var json2 = this.circle(jun2)
      var json3 = this.circle(jun3)
      this.setData({
        senior: wx.getStorageSync('navbar'),
        junior0: json0,
        junior1: json1,
        junior2: json2,
        junior3: json3
      })
    }
  },
  circle: function (e) {
    var zero = '';
    var json = null;
    for (var i = 0; i < e.length; i++) {
      if (i == e.length - 1) {
        zero = zero + '{ "name":' + '"' + e[i] + '"' + ', "value":' + '"' + e[i] + '"' + '}'
      } else {
        zero = zero + '{ "name":' + '"' + e[i] + '"' + ', "value":' + '"' + e[i] + '"' + '},'
      }
    }
    var arrayJson = "[" + zero + "]";
    json = JSON.parse(arrayJson);
    console.log(json)
    return json;
  },
  cacelTap: function () {
    wx.navigateBack()
  },
})