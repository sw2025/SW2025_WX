// pages/process/process.js
Page({
  data: {
    task: [],
    epid: '',
    etid: '',
    eventid:'',
  },
  /**生命周期函数--监听页面加载**/
  onLoad: function (options) {
    wx.removeStorageSync('eps')
    console.log(options)
    this.data.epid = options.epid;
    this.data.eventid = options.eventid;
    this.loadData();
  },
  /**生命周期函数--监听页面显示**/
  onShow: function () {
    if (wx.getStorageSync('eps')) {
      this.data.epid = wx.getStorageSync('eps')
      this.loadData();
    }
  },
  /**
   * 加载数据
   */
  loadData: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var datas = {
      epid: that.data.epid
    };
    wx.request({
      url: 'https://api.sw2025.com/api/getDailyPlan?token=' + token,
      method: 'POST',
      data: datas,
      success: function (res) {
        console.log(res)
        if (res.data.return_code == 200) {
          that.setData({
            task: res.data.data,
          })
        }
      }
    })
  },
  /**完成日程 */
  finishAll:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var url = 'https://api.sw2025.com/api/dailyOver?token='+token;
    var datas = {
      eventid:that.data.eventid,
    }
    wx.request({
      url: url,
      method:'POST',
      data:datas,
      success:function(res){
        wx.navigateBack({
          delta:2,
        })
        console.log(res.data)
      }
    })
  },
  /**修改状态 */
  stateTap: function (e) {
    var that = this;
    var etid = e.currentTarget.dataset.etid;
    var token = wx.getStorageSync('token');
    if (e.currentTarget.dataset.state == 0) {
      var datas = {
        etid: etid,
      };
      wx.showActionSheet({
        itemList: ['完成日程', '删除日程'],
        success: function (res) {
          switch (res.tapIndex) {
            case 0:
              wx.request({
                url: 'https://api.sw2025.com/api/dailyFinish?token=' + token,
                method: 'POST',
                data: datas,
                success: function (res) {
                  console.log(res.data)
                  that.loadData();
                }
              })
              break;
            case 1:
              that.deleteDaily(etid);
              break;
            default:
              break;
          }
        },
      })
    } else {
      wx.showActionSheet({
        itemList: ['删除日程'],
        success: function (res) {
          switch (res.tapIndex) {
            case 0:
              that.deleteDaily(etid);
              break;
            default:
              break;
          }
        },
      })
    }
  },
  addTap: function () {
    wx.navigateTo({
      url: '../addpro/addpro?epid=' + this.data.epid,
    })
  },

  /**
   * 删除日程
   */
  deleteDaily: function (etid) {
    var that = this;
    var datas = {
      etid: etid
    }
    wx.request({
      url: 'https://api.sw2025.com/api/dailyDelete?token=' + wx.getStorageSync('token'),
      method: 'POST',
      data: datas,
      success: function (res) {
        console.log(res.data)
        that.loadData();
      }
    })
  },
})