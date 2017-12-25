// pages/cooperate/cooperate.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    look: true,
    temp: null,
    picture: '',
    pid: '',
    eventid: '',
    documenturl: '',
    epid: '',
    hide: true,
    remarkInfo: [],
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this
    that.setData({
      step: options.step,
      processname: options.processname,
      processdescription: options.processdescription,
      temp: options.temp,
      documenturl: options.documenturl,
      pid: options.pid,
      eventid: options.eventid,
      len: options.len,
      epid: options.epid,
      state: options.state,
    })
    var template = that.data.temp
    WxParse.wxParse('template', 'html', template, that, 5);
  },

  /**确认资料 */
  confirmRes: function () {
    var that = this;
    var url = 'https://api.sw2025.com/api/eventStepOver?token=' + wx.getStorageSync('token');
    var datas = {
      pid: that.data.pid,
      eventid: that.data.eventid,
    };
    wx.showModal({
      title: '提示',
      content: '是否继续参与办事？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: url,
            method: 'POST',
            data: datas,
            success: function (res) {
              // wx.setStorageSync('events', that.data.eventid);
              wx.showModal({
                title: '提示',
                content: '确认成功',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack();
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**终止合作 */
  stopPart: function () {
    this.setData({
      hide: false,
    })
  },
  hideMark: function () {
    this.setData({
      hide: true,
    })
  },
  bindconfirm: function (e) {
    this.data.str = e.detail.value;
  },
  bindFormSubmit: function (e) {
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '请输入描述！',
        icon: 'success',
        duration: 2000
      })
    } else {
      var that = this;
      var url = 'https://api.sw2025.com/api/eventOver?token=' + wx.getStorageSync('token');
      var datas = {
        eventid: that.data.eventid,
        remark: e.detail.value.textarea,
      }
      wx.request({
        url: url,
        method: 'POST',
        data: datas,
        success: function (res) {
          console.log(res.data)
          wx.navigateBack({
            delta: 2
          })
        }
      })
    }
  },
  /*** 上传资料 */
  uploadFile: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://api.sw2025.com/api/uploadFile?token=' + wx.getStorageSync('token'),
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            pid: that.data.pid,
            eventid: that.data.eventid
          },
          success: function (res) {
            console.log(res.data)
            that.setData({
              picture: tempFilePaths,
            })
            wx.showModal({
              title: '提示',
              content: '上传成功，等待对方确认资料',
            })
          }
        })
      }
    })
  },
  /*** 下载并打开资料 */
  downloadFile: function (e) {
    var that = this;
    var url = 'http://images.sw2025.com' + that.data.documenturl;
    var filepath = that.data.documenturl;
    if (that.data.documenturl == "null") {
      wx.showToast({
        title: '请等待对方上传资料',
        duration: 4000
      })
    } else {
      var extStart = filepath.lastIndexOf(".");
      var ext = filepath.substring(extStart, filepath.length).toUpperCase();
      console.log(url)
      wx.downloadFile({
        url: url,
        success: function (res) {
          if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
            console.log('文件')
            var filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开成功')
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '无法预览该格式文件，请下载APP',
                })
              },
              complete: function (res) {
                console.log(res);
              }
            })
          } else {
            // 预览图片
            var filePath = res.tempFilePath
            wx.previewImage({
              current: '', // 当前显示图片的http链接
              urls: filePath.split() // 需要预览的图片http链接列表
            })
            console.log('图片')
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '提示',
            content: '下载失败，请重新下载',
          })
        },

      })
    }
  },
  addOpinion: function () {
    wx.navigateTo({
      url: '../addopinion/addopinion?epid=' + this.data.epid + '&role=expert',
    })
  },
  lookTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/event/expertmyeventdetail?token=' + token;
    var datas = {
      eventid: that.data.eventid
    }
    wx.request({
      url: url,
      method: 'POST',
      data: datas,
      success: function (res) {
        var len = res.data.eventingInfo.length;
        var steep = len - that.data.step;
        console.log(that.data.step)
        console.log(res.data.eventingInfo[steep])
        var remarkInfo = res.data.eventingInfo[steep].remarkInfo;
        that.setData({
          remarkInfo: res.data.eventingInfo[steep].remarkInfo,
        })
      }
    })


    if (this.data.look) {
      this.setData({
        look: false,
      })
    } else {
      this.setData({
        look: true,
      })
    }
  },

})