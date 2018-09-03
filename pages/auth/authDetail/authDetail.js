// authDetail.js
var app = getApp()
var firstLoaded = false
var isDeleting = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: new Date().getFullYear(),
    intentAuthId: null,
    errorString: '',
    showTopTips: false,
    deleteButtonString: "删除安全令",
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '安全令详情'
    })
    var that = this;
    wx.checkSession({
      success: function () {
        that.loadAuthDetail();
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
    this.setData({
      intentAuthId: options.authId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  loadAuthDetail: function () {
    var that = this;
    let url = app.apiUrl.authInfo;
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
          case 404:
            wx.setStorageSync("canAddMoreAuth", true)
            wx.setStorageSync("authCount", 0)
            wx.redirectTo({
              url: '/pages/auth/addAuthByServer/addAuthByServer',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            return;
            break;
          case 200:
            firstLoaded = true;
            that.setData({
              data: res.data.data
            })
            wx.setStorageSync(
              "canAddMoreAuth", res.data.data.canAddMoreAuth
            )
            wx.setStorageSync(
              "authCount", res.data.data.authCount
            )
            return;
            break;
          default:
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },
  showDeleteAuthDialog(){
    var that = this;
    wx.showModal({
      title: '确定删除这枚安全令吗',
      content: "删除后您将无法继续查看这枚安全令的信息",
      cancelText: "取消",
      cancelColor: "#be2a0f",
      confirmText: "确定",
      confirmColor: "#4a8102",
      success: function (res2) {
        if (res2.confirm) {
          that.deleteAuth()
        }
      },
      fail: function () {
        that.deleteAuth()
      }
    });
  },
  deleteAuth: function () {
    if (isDeleting) {
      return
    }  
    isDeleting = true
    var that = this;
    let url = app.apiUrl.authDelete;
    let token = wx.getStorageSync('skey')
    this.setData({
      disabled: true,
      loading: true,
      deleteButtonString: "删除中"
    })
    wx.request({
      url: url,
      data: {
        token_wechat_session_v1: token,
        authId: that.data.data.authId
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
          case 404:
            wx.setStorageSync("canAddMoreAuth", true)
            wx.setStorageSync("authCount", 0)
            wx.redirectTo({
              url: '/pages/auth/addAuthByServer/addAuthByServer',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            return;
            break;
          case 200:
            that.setData({
              disabled: false,
              loading: false,
              deleteButtonString: "删除成功"
            })
            wx.setStorageSync(
              "canAddMoreAuth", res.data.data.canAddMoreAuth
            )
            wx.setStorageSync(
              "authCount", res.data.data.authCount
            )
            app.globalData.deletedAuthNeedRefreshIndex = true; 
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              });
            }, 1500)
            return;
            break;
          default:
            that.showTopTips(res.data.message);
            that.setData({
              disabled: false,
              loading: false,
              deleteButtonString: "删除安全令"
            })
            break;
        }
      },
      fail: function (e) {
        that.showTopTips('删除失败，请检查网络连接是否正常');
        that.setData({
          disabled: false,
          loading: false,
          deleteButtonString: "删除安全令"
        })
      },
      complete: function () {
        isDeleting = false;
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