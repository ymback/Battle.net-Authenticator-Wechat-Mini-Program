// account.js
var app = getApp()
var hasSuccessLoaded = false;
var isUnbinding = false;
var isLoading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorString: '',
    showTopTips: false,
    disabled: false,
    loading: false,
    userName: "",
    userId: "",
    userRight: "",
    userEmail: "",
    userEmailChecked: "",
    userRegisterTime: "",
    userLastLoginTime: "",
    userLastLoginIp: "",
    showPageHint: "查看账号详细信息",
    unbindButtonString: "解除账号绑定"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '账号信息'
    })
  },
  unBindDialog: function () {
    var that = this;
    wx.showModal({
      title: '解除账号绑定',
      content: "解除账号绑定后您无法使用小程序继续查看安全令信息，您的数据依然保存在线上，您可以重新绑定账号或使用该账号登录线上版本继续使用，确认解绑吗？",
      cancelText: "取消",
      cancelColor: "#be2a0f",
      confirmText: "确认",
      confirmColor: "#4a8102",
      success: function (res2) {
        if (res2.confirm) {
          that.doUnBind();
        }
      }
    });
  },
  doUnBind: function () {
    if (isUnbinding) {
      return;
    }
    isUnbinding = true;
    var that = this;
    let url = app.apiUrl.unBind;
    let token = wx.getStorageSync('skey')
    this.setData({
      disabled: true,
      loading: true,
      unbindButtonString: "解绑中"
    })
    wx.request({
      url: url,
      data: {
        token_wechat_session_v1: token
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        switch (res.data.code) {
          case 200:
          case 401:
          case 428:
            that.setData({
              disabled: false,
              loading: false,
              unbindButtonString: "解绑成功"
            })
            wx.removeStorageSync("userName")
            wx.removeStorageSync("key")
            wx.removeStorageSync("canAddMoreAuth")
            wx.removeStorageSync("authCount")
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/bind/bind'
              });
            }, 1500)
            break;
          default:
            that.showTopTips(res.data.message);
            that.setData({
              disabled: false,
              loading: false,
              unbindButtonString: "解除账号绑定"
            })
            break;
        }
      },
      fail: function (e) {
        that.showTopTips('解绑失败，请检查网络连接是否正常');
        that.setData({
          disabled: false,
          loading: false,
          unbindButtonString: "解除账号绑定"
        })
      },
      complete: function () {
        isUnbinding = false;
      }
    })
  },
  loadAccountInfo: function () {
    if (isLoading) {
      return;
    }
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在读取账号信息',
        mask: true
      })
    } else {
      wx.showToast({
        title: '正在读取账号信息成功',
        icon: 'loading',
        duration: 10000000
      })
    }
    isLoading = true;
    var that = this;
    let url = app.apiUrl.userInfo;
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
        switch (res.data.code) {
          case 200:
            that.setData({
              showPageHint: "查看账号详细信息",
            });
            hasSuccessLoaded = true;
            var right;
            switch (res.data.data.userRight) {
              case 0:
                right = "普通账号";
                break;
              case 1:
                right = "共享账号";
                break;
              case 999:
                right = "封禁账号";
                break;
              default:
                right = "未知权限";
                break;
            }
            if (res.data.data.userDonated) {
              right = right + "（捐赠者）";
            }
            that.setData({
              userName: res.data.data.userName,
              userId: res.data.data.userId,
              userRight: right,
              userEmail: res.data.data.userEmail,
              userEmailChecked: res.data.data.userEmailChecked ? "已确认" : "未确认",
              userRegisterTime: res.data.data.userRegisterTime,
              userLastLoginTime: res.data.data.userLastLoginTime,
              userLastLoginIp: res.data.data.userLastLoginIp
            })
            break;
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
          default:
            that.setData({
              showPageHint: "加载账号信息失败",
            });
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function () {
        that.setData({
          showPageHint: "加载账号信息失败",
        });
        that.showTopTips('加载账号信息失败，请检查网络连接是否正常');
      },
      complete: function () {
        wx.hideLoading()
        wx.hideNavigationBarLoading() 
        isLoading = false;
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!hasSuccessLoaded) {
      this.loadAccountInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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