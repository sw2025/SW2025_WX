//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    caption: '系统共匹配到',
    nickname: '未登录',
    navbar: [],
    arr: [],
    currentTab: 0,
    array0: [],
    array1: [],
    array2: [],
    array3: [],
    myHidden: true,//遮罩层默认隐藏
    animationData: {},
    enter: '',
    expert: '',
    // configid: '',
    count: 0,
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://api.sw2025.com/api/eventType',
      method: 'GET',
      success: function (res) {
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
        that.setData({
          navbar: wx.getStorageSync('navbar'),
          array0: wx.getStorageSync('array0'),
          array1: wx.getStorageSync('array1'),
          array2: wx.getStorageSync('array2'),
          array3: wx.getStorageSync('array3'),
        })
        that.match()
      }
    })
    wx.removeStorageSync('mydata')//必须移除
    wx.removeStorageSync('select')//必须移除
    wx.removeStorageSync('pushexp')//必须移除
    wx.removeStorageSync('count')//必须移除
    that.data.currentTab = parseInt(options.currentTab);
    that.setData({
      currentTab: that.data.currentTab,
    })
  },
  // 初始化
  initData: function () {
    this.setData({
      nickname: '未登录'
    })
  },
  onShow: function () {
    this.match()
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      str: wx.getStorageSync('mydata')
    })
    try {
      if (wx.getStorageSync('token')) {
        that.data.URL = 'https://api.sw2025.com/api/authMe?token=' + token
        wx.request({
          url: that.data.URL,
          method: 'POST',
          success: function (res) {
            console.log(res.data[0])
            if (res.data[0].return_code == 200) {
              that.setData({
                enter: res.data[0].enterprise,
                expert: res.data[0].expert,
              })
              if (res.data[0].user.nickname == null || res.data[0].user.nickname == "") {
                res.data[0].user.nickname = "未设置"
              }
              that.setData({
                nickname: res.data[0].user.nickname
              })
            }
          },
        })
      } else {
        that.initData()
      }
    }
    catch (e) { }
  },
  /**我的账户 */
  account: function () {
    var expertId = '';
    var enterId = '';
    console.log(this.data.enter.length)
    console.log(this.data.expert.length)
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else {
      if (this.data.expert.length !== 0 ) {
        expertId = this.data.expert[0].configid
      }
      if (this.data.enter.length !== 0){
        enterId = this.data.enter[0].configid
      }
      wx.navigateTo({
        url: '../account/account?exp=' + expertId + '&enterp=' + enterId,
      })
    }
  },
  // 匹配专家
  match: function () {
    var that = this
    var domain1 = '';
    var domain2 = '';
    switch (that.data.currentTab) {
      case 0:
        domain1 = that.data.navbar[0]
        domain2 = that.data.array0[that.data.index0]
        break;
      case 1:
        domain1 = that.data.navbar[1]
        domain2 = that.data.array1[that.data.index1]
        break;
      case 2:
        domain1 = that.data.navbar[2]
        domain2 = that.data.array2[that.data.index2]
        break;
      case 3:
        domain1 = that.data.navbar[3]
        domain2 = that.data.array3[that.data.index3]
        break;
    }
    var token = wx.getStorageSync('token')
    var datas = {
      type01: domain1,
      type02: domain2,
    }
    that.data.URL = 'https://api.sw2025.com/api/expert/sysexpert?token=' + token
    // wx.setStorageSync('type01', domain1)
    // wx.setStorageSync('type02', domain2)
    wx.request({
      url: that.data.URL,
      data: datas,
      method: 'POST',
      success: function (res) {
        if (wx.getStorageSync('select') == "1") {
          that.setData({
            caption: '您选择了',
            count: wx.getStorageSync('count')
          })
        } else {
          that.setData({
            caption: '系统共匹配到',
            count: res.data.data
          })
        }
      },
    })

  },
  // 指定专家
  appoint: function () {
    wx.navigateTo({
      url: '../match/match'
    })
  },
  // 点击名字
  nameviewtap: function () {
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else {
      wx.navigateTo({
        url: '../username/username',
      })
      this.slideLeft();
    }
  },
  // 导航跳转
  navbarTap: function (e) {
    this.data.currentTab = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    wx.setStorageSync('select', "0")
    this.match();
  },
  // 下拉选择
  bindPickerChange: function (e) {
    wx.setStorageSync('select', "0")
    switch (this.data.currentTab) {
      case 0:
        this.data.index0 = e.detail.value;
        this.setData({
          index0: e.detail.value,
        })
        this.match();
        break;
      case 1:
        this.data.index1 = e.detail.value;
        this.setData({
          index1: e.detail.value,
        })
        this.match();
        break;
      case 2:
        this.data.index2 = e.detail.value;
        this.setData({
          index2: e.detail.value,
        })
        this.match();
        break;
      case 3:
        this.data.index3 = e.detail.value;
        this.setData({
          index3: e.detail.value,
        })
        this.match();
        break;
    }
  },
  // 点击描述
  descTap: function () {
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else {
      wx.navigateTo({
        url: '../desc/desc',
      })
    }
  },
  // 历史记录
  history: function () {
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else if (this.data.enter.length == 0 || this.data.enter[0].configid !== 3 ){
      wx.showModal({
        title: '提示',
        content: '您还未认证，暂时不能发布',
        showCancel: false,
      })
    }else {
      wx.navigateTo({
        url: '../history/history',
      })
     }
  },
  // 企业认证
  enterprise: function () {
    var enterId = '';
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else if (this.data.enter.length == 0) {
      //console.log("jump") ;
      wx.navigateTo({
        url: '../enterprise/enterprise?enterId=' + enterId,
      })
    } else {
      //console.log("jump02");
      wx.navigateTo({
        url: '../reenter/reenter',
      })
    }
  },
  // 专家入口
  expertTap: function () {
    //console.log(this.data.expert)
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else if (this.data.expert.length == 0) {
      wx.navigateTo({
        url: '../expert/expert',
      })
    } else if (this.data.expert[0].configid == 2) {
      wx.navigateTo({
        url: '../recommend/recommend',
      })
    } else {
      wx.navigateTo({
        url: '../reexp/reexp',
      })
    }
  },
  // 退出
  logOut: function () {
    var that = this
    if (wx.getStorageSync('isLogin')) {
      wx.showModal({
        title: '温馨提示',
        content: '确定退出吗？',
        success: function (res) {
          if (res.confirm) {
            wx.clearStorageSync()
            that.slideLeft()
            that.setData({
              myHidden: true,
              nickname: '未登录'
            })
            wx.switchTab({
              url: '../swindex/swindex?currentTab=0'
            })
          }
        }
      })
    }
  },
  // 点击发布
  releaseTap: function () {
    if (!wx.getStorageSync('isLogin')) {
      this.jumpLogin();
    } else if (this.data.enter[0].configid !== 3) {
      wx.showModal({
        title: '提示',
        content: '请您先进行企业认证',
        showCancel: false,
        success: function (res) { }
      })
    } else if (this.data.count == 0) {
      wx.showModal({
        title: '提示',
        content: '尚没有可匹配专家，暂时不能发布',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      if (wx.getStorageSync('select') == '') {
        wx.setStorageSync('select', 0);
        console.log(wx.getStorageSync('select'))
      }
      this.toPublish();
    }
  },
  // 登录
  jumpLogin: function () {
    wx.navigateTo({
      url: '../login/login'
    })
    this.slideLeft();
  },
  //发布
  toPublish: function () {
    console.log(wx.getStorageSync('select'))
    var that = this
    var domain1 = '';
    var domain2 = '';
    // console.log(wx.getStorageSync('pushexp'));
    switch (that.data.currentTab) {
      case 0:
        domain1 = that.data.navbar[0]
        domain2 = that.data.array0[that.data.index0]
        break;
      case 1:
        domain1 = that.data.navbar[1]
        domain2 = that.data.array1[that.data.index1]
        break;
      case 2:
        domain1 = that.data.navbar[2]
        domain2 = that.data.array2[that.data.index2]
        break;
      case 3:
        domain1 = that.data.navbar[3]
        domain2 = that.data.array3[that.data.index3]
        break;
    }
    var token = wx.getStorageSync('token')
    var datas = {
      type01: domain1,
      type02: domain2,
      brief: wx.getStorageSync('mydata'),
      select: wx.getStorageSync('select'),
      expert: wx.getStorageSync('pushexp'),
    }
    that.data.URL = 'https://api.sw2025.com/api/event/eventapply?token=' + token
    wx.request({
      url: that.data.URL,
      data: datas,
      method: 'POST',
      success: function (res) {
        console.log(res)
        switch (res.data.return_code) {
          case "200":
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 3000
            })
            that.setData({
              str: ''
            })
            wx.removeStorageSync('mydata')
            break;
          case 202:
          case 203:
          case 204:
            wx.showModal({
              title: '提示',
              content: '你还未开通会员或者会员时间已到期，请您开通会员或单次消费',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../member/member',
                  })
                }
              }
            })
            break;
          case 205:
            wx.showModal({
              title: '提示',
              content: '你已超出剩余使用次数，可享受优惠充值',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../counts/counts',
                  })
                }
              }
            })
            break;
          case "403":
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 3000
            })
            that.setData({
              str: ''
            })
            wx.removeStorageSync('mydata')
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '请填写完整内容',
            })
            break;
        }
      },
    })
  },
  // 点击滑动效果
  slideRight: function () {
    var animation = wx.createAnimation({
      duration: 800,
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
  slideLeft: function () {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease'
    })
    this.animation = animation;
    animation.translateX(-120 + '%').step();
    this.setData({
      animationData: animation.export(),
      myHidden: true
    })
  }
})
