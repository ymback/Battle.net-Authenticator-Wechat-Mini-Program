// index.js
var app = getApp()
var second = 0;
var refreshCodeProgressInter = null;
var oneButtonAuthInter = null;
var oneButtonAuthLoadTimeout = null;
var firstLoaded = false;
var onHide = false;
var screenWidth = 0;
Page({
  data: {
    currentYear: new Date().getFullYear(),
    progress: 0,
    authCode: "正在加载",
    errorString: '',
    showTopTips: false,
    disabled: false,
    loading: false,
    refreshCodeButtonString: "刷新",
    refreshButtonVisiable: "display:none;",
    copyButtonVisiable: "display:none;",
    intentAuthId: "",
    pageBackgroundClassIndex: 0,
    addAuthViewClass: "weui-btn-area hidden",
    pageBackgroundClarrArray: ["page-background-ow", 'page-background-d3', "page-background-hs", "page-background-wow1", "page-background-wow2", "page-background-wow3"]
  },
  onReady: function () {
    this.drawCircle(0);
  },
  drawCircle: function (percent) {
    if (percent > 100) {
      percent = 100;
    }
    var x = (screenWidth / 750) * 300;
    var y = (screenWidth / 750) * 300;
    var r = (screenWidth / 750) * 256;
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
    if (percent < 100) {
      cxt_arc.setLineWidth(10);
      cxt_arc.setStrokeStyle('#333333');
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();
      cxt_arc.arc(x, y, r, 2 * Math.PI * percent / 100 - 0.5 * Math.PI, 1.5 * Math.PI, false);
      cxt_arc.stroke();  
    }
    if (percent == 0) {
      cxt_arc.draw();
      return;
    }
    if (percent <= 50) {
      var color = "rgb(116,223,0)";
    } else if (percent < 75) {
      var colorR = parseInt((percent - 50) * 5.56 + 116);
      var colorG = parseInt(223 - (percent - 50) * 3.36);
      var color = "rgb(" + colorR + "," + colorG + ",0)"
    } else {
      var colorG = parseInt(139 - (percent - 75) * 5.56);
      var color = "rgb(255," + colorG + ",0)"
    }
    cxt_arc.setStrokeStyle(color);
    cxt_arc.setLineWidth(10);
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(x, y, r, -0.5 * Math.PI, 2 * Math.PI * percent / 100 - 0.5 * Math.PI, false);
    cxt_arc.stroke();//对当前路径进行描边  
    if (percent >= 83 && percent < 84) {
      var rTemp = parseInt(15 * (percent - 83))
      cxt_arc.setStrokeStyle(color);
      cxt_arc.setLineWidth(rTemp + 3);
      var arc = (2 - percent / 50) * Math.PI
      var circleX = (screenWidth / 750) * (300 - 260 * Math.sin(arc));
      var circleY = (screenWidth / 750) * (300 - 260 * Math.cos(arc));
      var circleR = (screenWidth / 750) * rTemp;
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(circleX, circleY, circleR, 0, 2 * Math.PI, false);
      cxt_arc.stroke();//对当前路径进行描边
    } else if (percent >= 84 && percent < 99.5) {
      cxt_arc.setStrokeStyle(color);
      cxt_arc.setLineWidth(18);
      var arc = (2 - percent / 50) * Math.PI
      var circleX = (screenWidth / 750) * (300 - 260 * Math.sin(arc));
      var circleY = (screenWidth / 750) * (300 - 260 * Math.cos(arc));
      var circleR = (screenWidth / 750) * 15;
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(circleX, circleY, circleR, 0, 2 * Math.PI, false);
      cxt_arc.stroke();//对当前路径进行描边


      cxt_arc.setFontSize((screenWidth / 750) * 48)
      var showSecond = parseInt((100 - percent) * 0.3) + 1;
      showSecond = showSecond > 5 ? 5 : showSecond
      cxt_arc.setFillStyle("white")
      cxt_arc.setTextAlign('center')
      cxt_arc.fillText(showSecond, circleX, circleY + (screenWidth / 750) * 16)
    } else if (percent >= 99.5 && percent <= 100) {
      var rTemp = parseInt(15 * (100 - percent) * 2)
      cxt_arc.setStrokeStyle(color);
      cxt_arc.setLineWidth(rTemp + 3);
      var arc = (2 - percent / 50) * Math.PI
      var circleX = (screenWidth / 750) * (300 - 260 * Math.sin(arc));
      var circleY = (screenWidth / 750) * (300 - 260 * Math.cos(arc));
      var circleR = (screenWidth / 750) * rTemp;
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(circleX, circleY, circleR, 0, 2 * Math.PI, false);
      cxt_arc.stroke();//对当前路径进行描边
    }
    cxt_arc.draw();
  },
  onShow: function () {
    onHide = false;
    var that = this;
    if (wx.getStorageSync("canAddMoreAuth")) {//每次ONSHOW的时候判断是否可以添加
      this.setData({
        addAuthViewClass: "weui-btn-area"
      })
    }
    if (app.globalData.deletedAuthNeedRefreshIndex){
      app.globalData.deletedAuthNeedRefreshIndex=false;
      app.globalData.intentAuthInfo=null;
    }
    if (app.globalData.intentAuthInfo != null) {//如果是令牌列表传参过来的，那么读取这个安全令
      console.log(app.globalData.intentAuthInfo.authName)
      if (this.data.intentAuthId != app.globalData.intentAuthInfo.authId) {
        wx.setNavigationBarTitle({
          title: app.globalData.intentAuthInfo.isDefault == true ? "默认安全令" : '查看安全令',
          fail: function (e) {
            console.log(e)
          }
        })
        this.setData({
          intentAuthId: app.globalData.intentAuthInfo.authId,
          authCode: "正在加载"
        })
        try {
          clearInterval(refreshCodeProgressInter);
        } catch (e) {
          console.log(e);
        } finally {
          refreshCodeProgressInter = null;
        }
        try {
          clearInterval(oneButtonAuthInter);
        } catch (e) {
          console.log(e);
        } finally {
          oneButtonAuthInter = null;
        }
        this.drawCircle(0);
        wx.checkSession({
          success: function (res) {
            that.doSync(true)
          },
          fail: function (res) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        })
      }
      app.globalData.intentAuthInfo = null;
    } else {
      wx.setNavigationBarTitle({
        title: '默认安全令'
      })
      wx.checkSession({
        success: function (res) {
          that.doSync(true)
        },
        fail: function (res) {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    }
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
  },
  doSync: function (needOneButtonAuthLoad) {
    if (needOneButtonAuthLoad) {
      clearTimeout(oneButtonAuthLoadTimeout);
      this.oneButtonAuthLoad()
    }
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
            if (!needOneButtonAuthLoad) {
              var randomNumber = parseInt(6 * Math.random());
              if (randomNumber == that.data.pageBackgroundClassIndex) {
                randomNumber = (that.data.pageBackgroundClassIndex + 1) % 6
              }
              that.setData({
                pageBackgroundClassIndex: randomNumber
              })
            }
            that.setData({
              authCode: res.data.data.dynamicCode,
              refreshButtonVisiable: "display:none;"
            })
            if (wx.setClipboardData) {
              that.setData({
                copyButtonVisiable: ""
              })
            }
            console.log(that.data.pageBackgroundClassIndex);
            second = res.data.data.usedSecond;
            refreshCodeProgressInter = setInterval(function () {
              if (that.data.progress >= 100) {
                that.setData({
                  progress: 0
                });
                that.doSync(false);
                return;
              }
              second = second + 0.016;
              var percent = 100 * (second / 30);
              that.setData({
                progress: percent
              });
              that.drawCircle(percent);
            }, 16);
            return;
            break;
          default:
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function () {
        that.setData({
          refreshButtonVisiable: "",
          authCode: "",
          copyButtonVisiable: "display:none;"
        })
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
              clearTimeout(oneButtonAuthLoadTimeout);
              oneButtonAuthLoadTimeout = setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
            }
          });
          return;
        }
        clearTimeout(oneButtonAuthLoadTimeout);
        oneButtonAuthLoadTimeout = setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      },
      fail: function () {
        clearTimeout(oneButtonAuthLoadTimeout);
        oneButtonAuthLoadTimeout = setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
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
        clearTimeout(oneButtonAuthLoadTimeout);
        oneButtonAuthLoadTimeout = setTimeout(() => { that.oneButtonAuthLoad() }, 5000)
      }
    })
  },
  seeAuthDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/auth/authDetail/authDetail?authId=' + that.data.intentAuthId,
    })
  },
  addMoreAuth: function () {
    wx.navigateTo({
      url: '/pages/auth/addAuthByServer/addAuthByServer',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  doCpoy: function () {
    var that = this;
    wx.setClipboardData({
      data: that.data.authCode,
      success: function () {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 1500,
        })
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
  }, onShareAppMessage: function () {
    return {
      title: '玻璃渣游戏安全',
      desc: '支持一键安全令的小程序版安全令查看器！',
      path: '/pages/index/index'
    }
  }
})