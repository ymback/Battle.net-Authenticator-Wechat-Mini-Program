// index.js
var app = getApp()
var second = 0;
var inter = null;
var isLoading = false;
Page({
  data: {
    progress: 0,
    authCode: ""
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的安全令'
    })

    var that = this;
    wx.getStorage({
      key: 'skey',
      success: function (res) {
        console.log(res.data)
      }
    })
    wx.checkSession({
      success: function (res) {
        console.log(res)
        that.doSync()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  doSync: function () {
    if (isLoading == true) {
      wx.showToast({
        title: '请等待刷新',
        duration: 2000
      })
      return;
    }
    isLoading = true;
    if (inter != null) {
      clearInterval(inter);
      inter = null;
    }
    wx.showLoading({
      title: '刷新中...',
    })
    var that = this;
    let url = "http://myauth.zuzhanghao.com/api/wechat/authDynamicCode";
    let token = wx.getStorageSync('skey')
    wx.request({
      url: url,
      data: {
        token_wechat_session_v1: token
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        isLoading = false;
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            authCode: res.data.data.dynamicCode
          })
          second = res.data.data.usedSecond;
          inter = setInterval(function () {
            if (that.data.progress >= 100) {
              that.setData({
                progress: 0
              });
              that.doSync();
              return;
            }
            second = second + 0.05;
            that.setData({
              progress: 100 * (second / 30)
            });
          }, 50);
        }
      }
    })

  }
})