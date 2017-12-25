var app = getApp();
Page({
  data: {
    str: ""
  },
  onShow: function(e){
    this.setData({
      str: wx.getStorageSync('mydata')
    })
  },
  bindconfirm: function (e) {
    this.data.str = e.detail.value;
  },
  cacelTap: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindFormSubmit: function (e) {
    console.log(e.detail.value.textarea)
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '请输入描述！',
        icon: 'success',
        duration: 2000
      })
    } else if (e.detail.value.textarea.length < 30){
      wx.showToast({
        title: '输入字数不得少于30字！',
        icon: 'success',
        duration: 2000
      })
    }else {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        data: {
          str: e.detail.value.textarea
        }
      })
      wx.setStorageSync('mydata', e.detail.value.textarea)
      wx.navigateBack();
    }
  }
})