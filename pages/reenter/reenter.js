// pages/reenter/reenter.js
Page({
  data: {
    enterprise:'',
    state:'',
    src:'',
    btnHtml:'',
    bgcolor:'',
    enterpriseid : "" ,
  },
  reVerify: function () {
    var that = this ; 
    if (this.data.state !== '正在审核...'){
      console.log(that.data.enterpriseid) ;
      wx.navigateTo({
        url: '../enterprise/enterprise?fromType=edit',
        
        //url: '../enterprise/enterprise?enterId=' + "18" ,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://api.sw2025.com/api/authMe?token=' + token,
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        var Lists = res.data[0].enterprise[0];
        that.data.enterpriseid = res.data[0].enterprise[0].enterpriseid ;
        switch (res.data[0].enterprise[0].configid){
          case 1:
            that.data.state = '正在审核...'
            that.data.src = '../images/checking.png'
            that.data.btnHtml = '正在审核'
            that.data.bgcolor = 'gray'
            break;
          case 2:
            that.data.state = '审核未通过'
            that.data.src = '../images/failure.png'
            that.data.btnHtml = '重新提交'
            that.data.bgcolor = 'red-btn'            
            break;
          default:
            that.data.state = '认证成功'
            that.data.src = '../images/success.png'
            that.data.btnHtml = '编辑资料'
            that.data.bgcolor = 'red-btn'
            break;
            
        }
        
        that.setData({
          enterprise: Lists,
          state: that.data.state,
          src: that.data.src,
          btnHtml: that.data.btnHtml,
          bgcolor: that.data.bgcolor,
        })
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },  
})