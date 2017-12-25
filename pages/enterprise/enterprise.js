// pages/enterprise/enterprise.js
Page({
  data: {
    objArray: [
      {
        index: null,
        title: '企业规模',
        option: ['不限', '20人以下', '20-99人', '100-499人', '500-999人', '1000-9999人', '10000人以上'],
      },
      {
        index: null,
        title: '所在行业',
        option: ['不限', 'IT|通信|电子|互联网', '金融业', '房地产|建筑业', '商业服务', '贸易|批发|零售|租赁业', '文体教育|工艺美术', '生产|加工|制造', '交通|运输|物流|仓储', '服务业', '文化|传媒|娱乐|体育', '能源|矿产|环保', '政府|非盈利机构', '农|林|牧|渔|其他'],
      },
      {
        index: null,
        title: '地 区',
        option: ['全国', '北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '内蒙古', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西', '海南省', '四川省', '贵州省', '云南省', '西藏', '陕西省', '甘肃省', '青海省', '宁夏', '新疆', '台湾省', '香港', '澳门'],
      },
    ],

    pic1: "",
    pic2: "",
    fromType : "" ,

  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!wx.getStorageSync('isLogin')) {
      wx.redirectTo({
        url: '../login/login',
      });
    }
    if (options !== null){
      that.data.fromType = options.fromType; // edit
    } 


      wx.request({
        url: 'https://api.sw2025.com/api/authMe?token=' + token,
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        success: function (res) {
          console.log(res.data[0])
          console.log(that.data.fromType) ;
          if (res.data[0].enterprise.length == 1 && that.data.fromType == "" ) {
            wx.redirectTo({
              url: '../reenter/reenter',
            })
          }
        }
      })
  },
  // 一级级联
  bindPicker: function (ev) {
    // 定义一个变量curindex 储存触发事件的数组对象的下标
    const curindex = ev.target.dataset.current
    //根据下标 改变该数组对象中的index值
    this.data.objArray[curindex].index = ev.detail.value
    //把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
    this.setData({
      objArray: this.data.objArray
    })
  },

  //选择图片
  bindChooseImage: function (e) {
    var _that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        if (e.currentTarget.dataset.type == 1) {
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
          /*******************************SB 代码******************************** */
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
          /******************************SB 代码********************************* */
        }
      },
    })
  },
  // form提交
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
    if (this.data.pic1 == '') {
      wx.showModal({
        title: '提示',
        content: '请添加营业执照',
      })
      auth = false;
    }
    if (this.data.pic2 == '') {
      wx.showModal({
        title: '提示',
        content: '请添加宣传照片',
      })
      auth = false;
    }
    if (!auth) {
      return;
    }
    var enterprisename = result.expertName;
    var size = this.data.objArray[0].option[this.data.objArray[0].index];
    var industry = this.data.objArray[1].option[this.data.objArray[1].index];
    var address = this.data.objArray[2].option[this.data.objArray[2].index];
    var brief = result.expIntro;
    var token = wx.getStorageSync("token");
    var showimage = this.data.pic2;
    var licenceimage = this.data.pic1;

    wx.request({
      url: "https://api.sw2025.com/api/smallRegisterEnterprise?token=" + token,
      method: "POST",
      data: {
        enterprisename: enterprisename,
        size: size,
        industry: industry,
        address: address,
        brief: brief,
        showimage: showimage,
        licenceimage: licenceimage
      },
      success: function (res) {
        console.log(res.data)
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
        }
      },
      fail: function (res) {
      }
    })
  },

})