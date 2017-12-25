// pages/details/details.js
Page({
  data: {
    Object: '',
    list: [],
    item: '',
    myHidden: true,
    stating: '',
    expList: [],
    inviteCount: 0,
    animationData: {},
    reason: '',
    configid: '',
    explist: true,
    working: [],
    len: '',
    eventid: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('events')
    this.data.eventid = options.id;
    this.loadData();
  },
  /*** 生命周期函数--监听页面显示 */
  onShow: function () {
    if (wx.getStorageSync('events')) {
      this.data.eventid = wx.getStorageSync('events')
      this.loadData();
    }
  },
  loadData: function () {
    var that = this
    var datas = {
      eventid: that.data.eventid
    }
    var url = 'https://api.sw2025.com/api/event/myeventdetail?token=' + wx.getStorageSync('token');
    wx.request({
      url: url,
      method: 'POST',
      data: datas,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.data[0].configid)
        if (res.data.return_code == 200) {
          wx.hideToast()
          that.data.Object = res.data;
          switch (that.data.Object.data[0].configid) {
            case 1:
              that.setData({
                stating: '系统资料审核'
              })
              break;
            case 2:
              that.setData({
                stating: '系统资料审核'
              })
              break;
            case 3:
              that.setData({
                stating: '系统资料审核',
                // reason: res.data.data[0].remark,
              })
              break;
            case 4:
              that.setData({
                stating: '发出邀请',
                expList: res.data.expertInfo,
                inviteCount: res.data.expertInfo.length,
              })
              break;
            case 5:
              that.setData({
                stating: '专家响应',
                expList: res.data.expertInfo,
              })
              break;
            case 6:
              that.setData({
                stating: '正在办事',
                working: res.data.eventingInfo,
                len: res.data.eventingInfo.length,
              })
              console.log(res.data.eventingInfo)
              break;
            case 7:
              that.setData({
                stating: '办事完成'
              })
              break;
            case 8:
              that.setData({
                stating: '评价完成',
                expList: res.data.markInfo,
              })
              if (that.data.expList.length == 0) {
                that.setData({
                  explist: true,
                })
              } else {
                that.setData({
                  explist: false,
                })
              }
              break;
            case 9:
              that.setData({
                stating: '异常终止',
                remark: res.data.data[0].remark,
              })
              break;
            default:
              break;
          }
          that.setData({
            Object: that.data.Object,
            item: that.data.Object.data[0],
            configid: that.data.Object.data[0].configid,
            list: that.data.Object.data.reverse(),
          });
        }
      }
    })
  },
  // 专家响应时选择专家
  selectExp: function (e) {
    this.setData({
      expertid: e.detail.value.join(','),
    })
    console.log('checkbox发生change事件，携带value值为：', this.data.expertid)
  },
  // 点击列表
  /**
  workTap: function (e) {
    var that = this;
    var step = e.currentTarget.dataset.lily.step;
    var processname = e.currentTarget.dataset.lily.processname;
    var processdescription = e.currentTarget.dataset.lily.processdescription;
    var temp1 = e.currentTarget.dataset.lily.Template;
    var remarkInfo = e.currentTarget.dataset.lily.remarkInfo;
    var filepath = e.currentTarget.dataset.lily.documenturl;
    if (temp1 !== null){
      var temp = temp1.replace(/\=/g, "%3D");
    }
    var epid = e.currentTarget.dataset.lily.epid;
    var pid = e.currentTarget.dataset.lily.pid;
    var eventid = e.currentTarget.dataset.lily.eventid;
    var state = e.currentTarget.dataset.lily.state;
    var len = that.data.len;
    console.log(remarkInfo)
    switch (step) {
      case 4:
        wx.navigateTo({
          url: '../process/process?epid=' + epid + '&eventid=' + eventid,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../cooperate/cooperate?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription +  '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../cooperate/cooperate?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription +  '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../cooperate/cooperate?step=' + step + '&processname=' + processname + '&processdescription=' + processdescription +  '&temp=' + temp + '&documenturl=' + filepath + '&pid=' + pid + '&eventid=' + eventid + '&len=' + len + '&epid=' + epid + '&state=' + state,
        })
        break;

    }
  },
  */
  sureTap:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/event/selectexpert?token=' + token;
    wx.request({
      url: url,
      method:'POST',
      data:{
        expertid:that.data.expertid,
        eventid:that.data.eventid,
      },
      success:function(res){
        if(res.data.return_code == "200"){
          wx.showModal({
            title: '提示',
            content: '选择专家成功',
            showCancel: false,
            success:function(res){
              if(res.confirm){
                wx.navigateBack({})
              }
            }
          })
        }
      }
    })
  },
  // 点击滑动效果
  slideLt: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    this.animation = animation;
    animation.translateX(0 + '%').step();
    this.setData({
      animationData: animation.export(),
      txtHidden: true,
      myHidden: false
    })
  },
  slideRt: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    this.animation = animation;
    animation.translateX(100 + '%').step();
    this.setData({
      animationData: animation.export(),
      myHidden: true
    })
  },
})
