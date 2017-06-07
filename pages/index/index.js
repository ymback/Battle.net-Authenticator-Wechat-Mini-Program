// index.js
var app = getApp()
var second = 0;
var refreshCodeProgressInter = null;
var oneButtonAuthInter = null;
var firstLoaded = false;
var onHide = false;
var screenWidth = 0;
Page({
  data: {
    progress: 0,
    authCode: "　　　　",
    errorString: '',
    showTopTips: false,
    disabled: false,
    loading: false,
    refreshCodeButtonString: "刷新",
    addAuthViewClass: "weui-btn-area hidden",
    intentAuthId: "",
    pageBackgroundClassIndex: 0,
    pageBackgroundClarrArray: ["page-background-ow", 'page-background-d3', "page-background-hs", "page-background-wow1", "page-background-wow2", "page-background-wow3"]
  },
  onReady: function () {
    this.drawCircle(0);
  },
  drawCircle: function (percent) {
    if (percent > 100) {
      percent = 100;
    }
    var x = (screenWidth - ((screenWidth / 750) * 150)) / 2;
    var y = (screenWidth - ((screenWidth / 750) * 150)) / 2;
    var r = ((screenWidth / 750) * 270);
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。


    if (percent < 100) {
      cxt_arc.setLineWidth(8);
      cxt_arc.setStrokeStyle('#333333');
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(x, y, r, 2 * Math.PI * percent / 100 - 0.5 * Math.PI, 1.5 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径  
      cxt_arc.stroke();//对当前路径进行描边  
    }
    if (percent == 0) {
      cxt_arc.draw();
      return;
    }
    cxt_arc.setLineWidth(8);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(x, y, r, -0.5 * Math.PI, 2 * Math.PI * percent / 100 - 0.5 * Math.PI, false);
    cxt_arc.stroke();//对当前路径进行描边  
    cxt_arc.draw();
  },
  onShow: function () {
    if (wx.getStorageSync("canAddMoreAuth")) {
      this.setData({
        addAuthViewClass: "weui-btn-area"
      })
    }
    this.oneButtonAuthLoad();
    onHide = false;
  },
  onHide: function () {
    onHide = true;
  },
  onLoad: function (option) {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenWidth);
        screenWidth = res.windowWidth
      }
    })
    var randomNumber = parseInt(6 * Math.random());
    if (randomNumber == this.data.pageBackgroundClassIndex) {
      randomNumber = (this.data.pageBackgroundClassIndex + 1) % 6
    }
    this.setData({
      pageBackgroundClassIndex: randomNumber
    })
    if (option === undefined || option.authId === undefined) {
      wx.setNavigationBarTitle({
        title: '默认安全令'
      })
    } else {
      this.setData({
        intentAuthId: option.authId
      })
      wx.setNavigationBarTitle({
        title: '查看安全令'
      })
    }

    var that = this;
    if (wx.getStorageSync("canAddMoreAuth")) {
      this.setData({
        addAuthViewClass: "weui-btn-area"
      })
    }
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
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      },
      complete: function (res) { },
    })
  },
  doSync: function () {
    if (onHide || this.data.loading) {
      return;
    }
    this.setData({
      loading: true,
      disable: true,
      refreshCodeButtonString: firstLoaded ? "刷新中" : "读取中",
    })
    var that = this;
    let url = app.apiUrl.authDynamicCode;
    let token = wx.getStorageSync('skey')
    try {
      clearInterval(refreshCodeProgressInter);
    } catch (e) {
      console.log(e);
    } finally {
      refreshCodeProgressInter = null;
    }
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
            var randomNumber = parseInt(6 * Math.random());
            if (randomNumber == that.data.pageBackgroundClassIndex) {
              randomNumber = (that.data.pageBackgroundClassIndex + 1) % 6
            }
            that.setData({
              authCode: res.data.data.dynamicCode,
              pageBackgroundClassIndex: randomNumber
            })
            console.log(that.data.pageBackgroundClassIndex);
            second = res.data.data.usedSecond;
            refreshCodeProgressInter = setInterval(function () {
              if (that.data.progress >= 100) {
                that.setData({
                  progress: 0
                });
                that.doSync();
                return;
              }
              second = second + 0.05;
              var percent = 100 * (second / 30);
              that.setData({
                progress: percent
              });
              that.drawCircle(percent);
            }, 50);
            return;
            break;
          default:
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function () {
        that.showTopTips((firstLoaded ? "刷新" : "读取") + "失败，请点击刷新重试");
      },
      complete: function () {
        that.setData({
          loading: false,
          disabled: false,
          refreshCodeButtonString: "刷新"
        });
      }
    })
  },
  oneButtonAuthLoad: function () {
    if (onHide) {
      return;
    }
    var that = this;
    let url = app.apiUrl.getOneButtonAuthRequestInfo
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
        wx.hideLoading()
        if (res.data.code == 428) {
          wx.redirectTo({
            url: '/pages/login/login'
          });
          return;
        }
        if (res.data.code == 200) {
          var json = res.data.data;
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
              setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
            }
          });
          return;
        }
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      },
      fail: function () {
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      }
    })
  },
  oneButtonAuthSendAgreement: function (jsondata, agreement) {
    if (agreement === "true") {
      if (wx.showLoading) {
        wx.showLoading({
          title: '允许一键登录中...',
          mask: true
        })
      } else {
        wx.showToast({
          title: '允许一键登录中...',
          icon: 'loading',
          duration: 10000000,
          mask: true
        })
      }
    } else {
      if (wx.showLoading) {
        wx.showLoading({
          title: '拒绝一键登录中...',
          mask: true
        })
      } else {
        wx.showToast({
          title: '拒绝一键登录中...',
          icon: 'loading',
          duration: 10000000,
          mask: true
        })
      }
    }
    console.log(jsondata.authId);
    console.log(jsondata.callbackUrl);
    console.log(jsondata.requestId);
    console.log(jsondata.time);
    var that = this;
    let url = app.apiUrl.commitOneKeyButtonAuthResponse
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
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 1500
        })
      },
      fail: function () {
        that.showTopTips("提交一键安全令请求失败")
      },
      complete: function () {
        wx.hideLoading()
        setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      }
    })
  },
  seeAuthDetail: function () {
    if (this.data.intentAuthId != "") {

    }
  },
  addMoreAuth: function () {
    wx.navigateTo({
      url: '/pages/auth/addAuthByServer/addAuthByServer',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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