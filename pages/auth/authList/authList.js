// authList.js
var app = getApp()
var isLoadingData = false;
var isAuthListLoadedSuccess = false;
Page({
  data: {
    authList: false,
    errorString: '',
    showTopTips: false,
    defaultSize: 'default',
    addAuthButtonStyle: "display:none;",
    scrollFixedClass: "scroll-fixed-no-button"
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的安全令',
    })
    app.globalData.needReloadAuthList = false;
    var that = this
    wx.checkSession({
      success: function (res) {
        console.log(res)
        that.loadAuthList()
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  onShow: function () {
    if (isAuthListLoadedSuccess && app.globalData.needReloadAuthList) {
      app.globalData.needReloadAuthList = false;
      isAuthListLoadedSuccess = false;
      this.loadAuthList();
    }
    if (wx.getStorageSync("canAddMoreAuth")) {
      this.setData({
        addAuthButtonStyle: "",
        scrollFixedClass: "scroll-fixed-has-button"
      })
    }
  },
  loadAuthList: function () {
    if (isLoadingData) {
      return;
    }
    isLoadingData = true;
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在载入令牌列表',
        mask: true
      })
    } else {
      wx.showToast({
        title: '正在载入令牌列表',
        icon: "loading",
        mask: true,
        duration: 10000000
      })
    }
    var that = this
    let url = app.apiUrl.authList;
    let token = wx.getStorageSync('skey')
    wx.request({
      url: url,
      data: {
        token_wechat_session_v1: token,
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        switch (res.data.code) {
          case 401:
          case 428:
            wx.removeStorageSync("userName")
            wx.removeStorageSync("key")
            wx.removeStorageSync("canAddMoreAuth")
            wx.removeStorageSync("authCount")
            wx.redirectTo({
              url: '/pages/login/login'
            });
            return;
            break;
          case 200:
            isAuthListLoadedSuccess = true;
            wx.setStorageSync(
              "canAddMoreAuth", res.data.data.canAddMoreAuth
            )
            wx.setStorageSync(
              "userName", res.data.data.userName
            )
            wx.setStorageSync(
              "authCount", res.data.data.authCount
            )
            if (res.data.data.canAddMoreAuth) {
              that.setData({
                addAuthButtonStyle: "",
                scrollFixedClass: "scroll-fixed-has-button"
              })
            } else {
              that.setData({
                addAuthButtonStyle: "display:none;",
                scrollFixedClass: "scroll-fixed-no-button"
              })
            }
            that.setData({
              authList: res.data.data.authList
            })
            break;
          default:
            that.setData({
              addAuthButtonStyle: "display:none;",
              scrollFixedClass: "scroll-fixed-no-button"
            })
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function (e) {
        that.showTopTips('加载安全令列表失败，请检查网络连接是否正常');
        that.setData({
          addAuthButtonStyle: "display:none;",
          scrollFixedClass: "scroll-fixed-no-button"
        })
      },
      complete: function () {
        isLoadingData = false;
        wx.hideLoading();
      },
    })
  },
  onAuthClick: function (e) {
    var authItem = this.data.authList[parseInt(e.currentTarget.dataset.id)];
    console.log(authItem.authName)
    app.globalData.intentAuthInfo = authItem
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  goToAddAuth: function () {
    wx.navigateTo({
      url: '/pages/auth/addAuthByServer/addAuthByServer',
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
  }
})