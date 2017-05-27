// login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '玻璃渣游戏安全令'
    })
    var that = this
    wx.checkSession({
      success: function () {
        console.log("checkSession.success")
        that.getAuthCount()
      },
      fail: function () {
        console.log("checkSession.fail")
        that.doLogin()
      }
    })
  },
  getAuthCount: function () {
    wx.showLoading({
      title: '拉取安全令信息中',
      icon: 'loading',
      mask: true
    });
    var that = this
    let url = app.apiUrl.authCount
    let token = wx.getStorageSync('skey')
    wx.request({
      url: url, data: {
        token_wechat_session_v1: token
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        switch (res.data.code) {
          case 200:
            if (res.data.data.count > 0) {
              wx.redirectTo({
                url: '/pages/index/index'
              })
            } else {
              wx.redirectTo({
                url: '/pages/auth/addAuthByServer/addAuthByServer'
              })
            }
            break;
          default:
            that.doLogin();
            break;
        }
      },
      fail: function () {
        that.doLogin();
      }
    })
  },
  doLogin: function () {
    wx.showLoading({
      title: '拉取登录信息中',
      icon: 'loading',
      mask : true
    });
    wx.login({
      success: function (res) {
        if (res.code) {
          let url = app.apiUrl.getSessionToken
          wx.request({
            url: url,
            data: { code: res.code },
            header: {},
            method: 'post',
            dataType: 'json',
            success: function (res) {
              wx.setStorageSync(
                "skey",
                res.data.data.token_wechat_session_v1
              )
              if (res.data.code == 200) {
                if (res.data.data.hasAuth === false) {
                  wx.redirectTo({
                    url: '/pages/auth/addAuthByServer/addAuthByServer',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/index/index',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              }
              else if (res.data.code == 428) {
                wx.redirectTo({
                  url: '/pages/bind/bind',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'loading'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '拉取用户信息失败',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})