// authList.js
var app = getApp()
var isLoadingData = false;
Page({

  data: {
    authList: [],
    errorString: '',
    showTopTips: false,
    show1: true,
    show2: true,
    show3: true,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的安全令',
    })
  },
  onShow: function () {
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
      },
      complete: function (res) { },
    })
  },
  loadAuthList() {
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
        authId: that.data.intentAuthId
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
            wx.setStorageSync(
              "canAddMoreAuth", res.data.data.canAddMoreAuth
            )
            wx.setStorageSync(
              "userName", res.data.data.userName
            )
            wx.setStorageSync(
              "authCount", res.data.data.authCount
            )
            that.setData({
              authList: res.data.data.authList
            })
            break;
          default:
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function (e) {
        that.showTopTips('加载安全令列表失败，请检查网络连接是否正常');
      },
      complete: function () {
        isLoadingData = false;
        wx.hideLoading();
      },
    })
  },
  longTapEvent: function (e) {
    let that = this;
    wx.showModal({
      title: '确认删除？',
      content: '删除本安全令',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            show1: false
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
  },

  longTapEvent: function (e) {
      let that = this;
      wx.showModal({
          title: '确认删除？',
          content: '删除本安全令',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                      show1: false
                  })
        }
      }
    });
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