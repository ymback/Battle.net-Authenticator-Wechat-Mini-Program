// index.js
var app = getApp()
var second = 0;
var inter = null;
var oneButtonAuthInter = null;
var isLoading = false;
var hasOneButtonAuthRequest = false;
Page({
  data: {
    progress: 0,
    authCode: ""
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '默认安全令'
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
        that.oneButtonAuthLoad()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  doSync: function () {
    if (isLoading == true) {
      if (!hasOneButtonAuthRequest) {
        wx.showToast({
          title: '请等待刷新',
          duration: 2000
        })
      }
      return;
    }
    isLoading = true;
    if (inter != null) {
      clearInterval(inter);
      inter = null;
    }
    if (!hasOneButtonAuthRequest) {
      wx.showLoading({
        title: '刷新中...',
      })
    }
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
      },
      complete: function () {
        isLoading = false;
        wx.hideLoading()
      }
    })
  },
  oneButtonAuthLoad: function () {
    var that = this;
    let url = "http://myauth.zuzhanghao.com/api/wechat/getOneButtonAuthRequestInfo";
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
          var json = res.data.data;
          hasOneButtonAuthRequest = true;
          wx.showModal({
            title: '收到一键安全令登录请求',
            content: "请求信息:" + json.message + "，" + '请求序号:' + json.requestId,
            cancelText: "拒绝",
            cancelColor: "#be2a0f",
            confirmText: "允许",
            confirmColor: "#4a8102",
            success: function (res2) {
              if (res2.confirm) {
                that.oneButtonAuthSendAgreement(res.data.data, "true");
              } else if (res2.cancel) {
                that.oneButtonAuthSendAgreement(res.data.data, "false");
              }
            },
            fail: function () {
              hasOneButtonAuthRequest = false;
              setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
            }
          });
          return;
        }
        hasOneButtonAuthRequest = false;
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      },
      fail: function () {
        hasOneButtonAuthRequest = false;
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      }
    })
  },
  oneButtonAuthSendAgreement: function (jsondata, agreement) {
    wx.showLoading({
      title: '提交中...',
    })
    console.log(jsondata.authId);
    console.log(jsondata.callbackUrl);
    console.log(jsondata.requestId);
    console.log(jsondata.time);
    var that = this;
    let url = "http://myauth.zuzhanghao.com/api/wechat/commitOneKeyButtonAuthResponse";
    let token = wx.getStorageSync('skey')
    wx.request({
      url: url,
      data: {
        token_wechat_session_v1: token,
        authId: jsondata.authId,
        callbackUrl: jsondata.callbackUrl,
        requestId: jsondata.requestId,
        time: jsondata.time,
        accept: agreement
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        isLoading = false;
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: "提交失败",
          icon: 'success',
          duration: 2000
        })
      },
      complete: function () {
        hasOneButtonAuthRequest = false;
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      }
    })
  }
})