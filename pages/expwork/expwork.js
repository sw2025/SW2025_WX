// pages/expwork/expwork.js
Page({
  data: {
    working: [],
    len: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.removeStorageSync('eventszhuan')
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/event/expertmyeventdetail?token=' + token;
    var datas = {
      eventid: options.eventid
    }
    wx.request({
      url: url,
      method: 'POST',
      data: datas,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.return_code == "200") {
          that.setData({
            working: res.data.eventingInfo,
            len: res.data.eventingInfo.length,
          })
        }
      }
    })
  },
  workTap: function (e) {
    var that = this;
    var step = e.currentTarget.dataset.lily.step;
    var processname = e.currentTarget.dataset.lily.processname;
    var processdescription = e.currentTarget.dataset.lily.processdescription;
    var temp1 = e.currentTarget.dataset.lily.Template;
    var remarkInfo = e.currentTarget.dataset.lily.remarkInfo;
    var filepath = e.currentTarget.dataset.lily.documenturl;
    var temp = temp1.replace(/\=/g, "%3D");
    var pid = e.currentTarget.dataset.lily.pid;
    var epid = e.currentTarget.dataset.lily.epid;
    var state = e.currentTarget.dataset.lily.state;
    var eventid = e.currentTarget.dataset.lily.eventid;
    var len = e.currentTarget.dataset.len;
    switch (step) {
      case 4:
        wx.navigateTo({
          url: '../process/process?epid=' + epid + '&eventid=' + eventid,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../expcoo/expcoo?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription +  '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../expcoo/expcoo?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription + '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../expcoo/expcoo?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription + '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (wx.getStorageSync('eventszhuan')) {
    //   this.data.eventid = wx.getStorageSync('eventszhuan')
    //   this.loadData();
    // }
  },

})