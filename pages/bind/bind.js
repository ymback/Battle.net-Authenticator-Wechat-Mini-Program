// bind.js
var app = getApp();
var hideCalled = false;
var bindSuccess = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    token: '',
    errorString: '',
    showTopTips: false,
    wechatNickname: null,
    bindButtonString: "绑定",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    bindSuccess = false;
    var that = this;
    wx.setNavigationBarTitle({
      title: '绑定已有账号'
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          wechatNickname: userInfo.nickName
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!hideCalled) {
      return;
    }
    if (wx.getStorageSync("userName") != undefined && wx.getStorageSync("userName") != "") {
      if (wx.getStorageSync("authCount") > 0) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.redirectTo({
          url: '/pages/auth/addAuthByServer/addAuthByServer',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    hideCalled = true;
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

  },
  register: function (e) {
    if (bindSuccess) {
      return;
    }
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  formSubmit: function (e) {
    if (bindSuccess) {
      return;
    }
    var that = this;
    let url = app.apiUrl.bindAccount;
    let token = wx.getStorageSync('skey')
    for (var key in e.detail.value) {
      if (e.detail.value[key] == '') {
        that.showTopTips("错误,输入值不能为空")
        return false
      }
    }
    this.setData({
      loading: true,
      disabled: true,
      bindButtonString: "绑定中",
    })
    wx.request({
      url: url,
      data: {
        username: e.detail.value.username,
        password: e.detail.value.password,
        token_wechat_session_v1: token,
        wechatNickname: that.data.wechatNickname
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        switch (res.data.code) {
          case 200:
            bindSuccess = true;
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
              loading: false,
              disabled: false,
              bindButtonString: "绑定成功",
            })
            if (res.data.data.hasAuth) {
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }, 1500)
            } else {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/auth/addAuthByServer/addAuthByServer'
                })
              }, 1500)
            }
            break;
          default:
            that.setData({
              loading: false,
              disabled: false,
              bindButtonString: "绑定",
            });
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function () {
        that.setData({
          loading: false,
          disabled: false,
          bindButtonString: "绑定",
        });
        that.showTopTips('绑定失败，请重试');
      }
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