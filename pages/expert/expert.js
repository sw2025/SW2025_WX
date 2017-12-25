// pages/expert/expert.js
Page({
  data: {
    objArray: [
      {
        index: null,
        title: '专家类别',
        option: ['专家', '机构', '企业家'],
      },
      {
        index: null,
        title: '服务地区',
        option: ['全国', '北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '内蒙古', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西', '海南省', '四川省', '贵州省', '云南省', '西藏', '陕西省', '甘肃省', '青海省', '宁夏', '新疆', '台湾省', '香港', '澳门'],
      },
      // {
      //   index: null,
      //   title: '擅长行业',
      //   option: ['不限', 'IT|通信|电子|互联网', '金融业', '房地产|建筑业', '商业服务', '贸易|批发|零售|租赁业', '文体教育|工艺美术', '生产|加工|制造', '交通|运输|物流|仓储', '服务业', '文化|传媒|娱乐|体育', '能源|矿产|环保', '政府|非盈利机构', '农|林|牧|渔|其他'],
      // },
    ],
    pic1: "",
    pic2: "",
  },
  // 监听页面加载
  onLoad: function () {
    wx.removeStorageSync('finds')
    wx.removeStorageSync('goods')
    if (!wx.getStorageSync('isLogin')) {
      wx.redirectTo({
        url: '../login/login',
      });
    } else {
      var that = this;
      var token = wx.getStorageSync('token');
      wx.request({
        url: 'https://api.sw2025.com/api/authMe?token=' + token,
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        success: function (res) {
          if (res.data[0].expert.length == 1) {
            switch (res.data[0].expert[0].configid) {
              case 1:
                wx.redirectTo({
                  url: '../reexp/reexp',
                })
                break;
              case 3:
                wx.redirectTo({
                  url: '../reexp/reexp',
                })
                break;
              default:
                wx.redirectTo({
                  url: '../recommend/recommend',
                })
                break;
            }
          }else{
            console.log('未认证过')
          }
        }
      })
    }
  },
  // 监听页面显示
  onShow: function () {
    this.setData({
      goods: wx.getStorageSync('goods'),
      finds: wx.getStorageSync('finds'),
    })
  },
  // 类别行业地区
  bindPicker: function (ev) {
    const curindex = ev.target.dataset.current
    this.data.objArray[curindex].index = ev.detail.value
    this.setData({
      objArray: this.data.objArray
    })
  },
  // 擅长问题
  goodAt: function () {
    wx.navigateTo({
      url: '../explist/explist'
    })
  },
  // 上传图片
  bindChooseImage: function (e) {
    var _that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        if (e.currentTarget.dataset.type == 1) {
          //对pic1赋值
          _that.data.pic1 = tempFilePaths;
          _that.setData({
            tempFilePaths: tempFilePaths,
          })
          /****************************SB 代码********************************** */
          var token = wx.getStorageSync('token');
          wx.uploadFile({
            url: 'https://api.sw2025.com/api/addPic?token=' + token,
            method: 'POST',
            filePath: tempFilePaths[0],
            name: 'pic',
            success: function (res) {
              //对pic1赋值
              _that.data.pic1 = res.data;
            },
            fail: function (res) {
              console.log(res);
            }
          })
          /*****************************SB 代码********************************** */
        } else {
          //对pic2赋值
          _that.data.pic2 = tempFilePaths;
          _that.setData({
            businessPath: tempFilePaths,
          })
          /****************************SB 代码********************************** */
          var token = wx.getStorageSync('token');
          wx.uploadFile({
            url: 'https://api.sw2025.com/api/addPic?token=' + token,
            method: 'POST',
            filePath: tempFilePaths[0],
            name: 'pic',
            success: function (res) {
              //对pic2赋值
              _that.data.pic2 = res.data;
            },
            fail: function (res) {
              console.log(res);
            }
          })
          /*****************************SB 代码********************************** */
        }
      },
    })
  },
  formSubmit: function (e) {
    var result = e.detail.value;
    var auth = true;
    for (var i = 0; i < this.data.objArray.length; i++) {
      if (this.data.objArray[i].index == null) {
        wx.showModal({
          title: '提示',
          content: '请您将认证信息填写完整',
        })
        auth = false;
        return;
      }
    }
    for (var i in result) {
      var obj = result[i];
      if (obj == "") {
        wx.showModal({
          title: '提示',
          content: '请您将认证信息填写完整',
        })
        auth = false;
        return;
      }
    };

    if (this.data.pic2 == '') {
      wx.showModal({
        title: '提示',
        content: '请添加宣传照片',
      })
      auth = false;
    }
    if (this.data.pic1 == '') {
      wx.showModal({
        title: '提示',
        content: '请添加凭证照片',
      })
      auth = false;
    }
    if (wx.getStorageSync('goods') == '') {
      wx.showModal({
        title: '提示',
        content: '请您将认证信息填写完整',
      })
    }
    if (!auth) {
      return;
    }
    var expertName = result.expertName;
    var category = this.data.objArray[0].option[this.data.objArray[0].index];
    var type01 = wx.getStorageSync('finds');
    var type02 = wx.getStorageSync('goods').join(',');
    var address = this.data.objArray[1].option[this.data.objArray[1].index];
    // var industry = this.data.objArray[2].option[this.data.objArray[2].index];
    var brief = result.expIntro;
    var token = wx.getStorageSync("token");
    var showimage = this.data.pic2;
    var licenceimage = this.data.pic1;
    var that = this;
    wx.request({
      url: "https://api.sw2025.com/api/smallRegisterExpert?token=" + token,
      method: "POST",
      data: {
        expertname: expertName,
        type01: type01,
        type02: type02,
        category: category,
        industry: '',
        address: address,
        brief: brief,
        showimage: showimage,
        licenceimage: licenceimage
      },
      success: function (res) {
        console.log(res.data)
        console.log(wx.getStorageSync('goods'))
        if (res.data.return_code == 200) {
          wx.showModal({
            title: '提示',
            content: '请等待审核',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../swindex/swindex?currentTab=0'
                })
              }
            }
          })
          that.setData({
            finds: '',
            goods: ''
          })
        }
      },
      fail: function (res) {
      }
    })
  },
})