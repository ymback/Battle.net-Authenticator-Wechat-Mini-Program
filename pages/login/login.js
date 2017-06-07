// login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorString: '',
    showTopTips: false,
    addAuthViewClass: "weui-btn-area loginPageReLoginButtonViewClass hidden",
    disabled: false,
    loading: false,
    reLoginButtonString: "重新登录"
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
        try {
          let userName = wx.getStorageSync("userName")
          console.log(userName)
          if (userName) {
            if (wx.getStorageSync("authCount") > 0) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              wx.redirectTo({
                url: '/pages/auth/addAuthByServer/addAuthByServer'
              })
            }
            return;
          }
        } catch (e) {
          that.doLogin()
          return;
        }
        that.doLogin()
      },
      fail: function () {
        console.log("checkSession.fail")
        that.doLogin()
      }
    })
  },
  getAuthCount: function () {
    // wx.showLoading({
    //   title: '拉取安全令信息中',
    //   icon: 'loading',
    //   mask: true
    // });
    // var that = this
    // let url = app.apiUrl.authCount
    // let token = wx.getStorageSync('skey')
    // wx.request({
    //   url: url, data: {
    //     token_wechat_session_v1: token
    //   },
    //   header: {},
    //   method: 'post',
    //   dataType: '',
    //   success: function (res) {
    //     switch (res.data.code) {
    //       case 200:
    //         if (res.data.data.count > 0) {
    //         }
    //         break;
    //       default:
    //         that.doLogin();
    //         break;
    //     }
    //   },
    //   fail: function () {
    //     that.doLogin();
    //   }
    // })
  },
  doLogin: function () {
    this.setData({
      loading: true,
      disabled: true,
      reLoginButtonString:"重新登录中"
    })
    if (wx.showLoading) {
      wx.showLoading({
        title: '拉取登录信息中',
        mask: true
      });
    } else {
      wx.showToast({
        title: '拉取登录信息中',
        mask: true,
        duration: 1000000,
        icon: 'loading'
      })
    }
    var that = this;
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
              wx.hideLoading();
              wx.setStorageSync(
                "skey",
                res.data.data.token_wechat_session_v1
              )
              wx.setStorageSync(
                "canAddMoreAuth",
                res.data.data.canAddMoreAuth
              )
              wx.setStorageSync(
                "authCount",
                res.data.data.authCount
              )
              wx.setStorageSync(
                "userName",
                res.data.data.userName
              )
              switch (res.data.code) {
                case 200:
                  if (res.data.data.hasAuth === false) {
                    wx.redirectTo({
                      url: '/pages/auth/addAuthByServer/addAuthByServer',
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
                    })
                  } else {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                  break;
                case 428:
                  wx.redirectTo({
                    url: '/pages/bind/bind',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                  break;
                default:
                  wx.showToast({
                    title: res.data.message,
                    icon: 'loading'
                  })
                  break;
              }
            },
            fail: function () {
              wx.hideLoading();
              that.showTopTips("拉取登录信息失败，请点击重新登录按钮");
              that.showLoginButton();
            }
          })
        } else {
          wx.hideLoading();
          that.showTopTips("获取微信登陆串失败，请点击重新登录按钮");
          that.showLoginButton();
        }
      },
      fail: function () {
        wx.hideLoading();
        that.showTopTips("获取微信登陆串失败，请点击重新登录按钮");
        that.showLoginButton();
      }
    })
  },
  showLoginButton: function () {
    this.setData({
      addAuthViewClass: "weui-btn-area loginPageReLoginButtonViewClass",
      loading: false,
      disabled: false,
      reLoginButtonString: "重新登录"
    })
  },
  showTopTips: function (error) {
    var that = this;
    this.setData({
      showTopTips: true,
      errorString: error
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
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