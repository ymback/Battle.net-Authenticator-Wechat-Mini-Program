// addAuthByServer.js
var app = getApp();
var hasAddAuthSuccess = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFromIndex: false,
    errorString: '',
    showTopTips: false,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    token: '',
    regionPickerArray: ["CN（国服）", "US（美服、台服、韩服）", "EU（欧服）"],
    authPicArray: [
      { id: 1, checked: 'true' },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ],
    selectAuthPic: 0,
    regionIndex: 0,
    setDefaultAuth: false,
    addAuthButtonString: "添加安全令"
  },
  wowRadioClick: function () {
    console.log("OW点击")
    this.setData({
      selectAuthPic: 0,
      authPicArray: [
        { id: 1, checked: 'true' },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
      ]
    })
  },
  scRadioClick: function () {
    console.log("SC点击")
    this.setData({
      selectAuthPic: 1,
      authPicArray: [
        { id: 1 },
        { id: 2, checked: 'true' },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
      ]
    })
  },
  d3RadioClick: function () {
    console.log("D3点击")
    this.setData({
      selectAuthPic: 2,
      authPicArray: [
        { id: 1 },
        { id: 2 },
        { id: 3, checked: 'true' },
        { id: 4 },
        { id: 5 },
        { id: 6 },
      ]
    })
  },
  hsRadioClick: function () {
    console.log("HS点击")
    this.setData({
      selectAuthPic: 3,
      authPicArray: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4, checked: 'true' },
        { id: 5 },
        { id: 6 },
      ]
    })
  },
  shRadioClick: function () {
    console.log("SH点击")
    this.setData({
      selectAuthPic: 4,
      authPicArray: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5, checked: 'true' },
        { id: 6 },
      ]
    })
  },
  owRadioClick: function () {
    console.log("OW点击")
    this.setData({
      selectAuthPic: 5,
      authPicArray: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6, checked: 'true' },
      ]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isFromIndex == 1) {
      this.setData({ isFromIndex: true });
    }
    wx.setNavigationBarTitle({
      title: '添加安全令'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    hasAddAuthSuccess = false;
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
            wx.setStorageSync("canAddMoreAuth", res.data.data.canAddMoreAuth);
            wx.setStorageSync("authCount", res.data.data.count);
            if (res.data.data.canAddMoreAuth) {
              return;
            }
            if (that.data.isFromIndex) {
              wx.navigateBack({
                delta: 1
              })
              return;
            }
            wx.redirectTo({
              url: '/pages/index/index',
            })
            break;
          default:
            break;
        }
      }
    })
  },
  regionPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      regionIndex: e.detail.value
    })
  },
  defaultAuthSwitchListener: function (e) {
    console.log('checkbox类型开关当前状态-----', e.detail.value)
    this.setData({
      setDefaultAuth: e.detail.value
    })
  },
  formSubmit: function (e) {
    if (hasAddAuthSuccess) {
      return;
    }
    var that = this;
    for (var key in e.detail.value) {
      if (e.detail.value[key] == '') {
        switch (key) {
          case 'authname':
            that.showTopTips('输入的安全令名称不能为空');
            break;
          default:
            that.showTopTips('输入项不能为空');
            break;
        }
        return false
      }
    }
    let authNameReg = /^\S{1,12}$/
    if (!authNameReg.test(e.detail.value.authname)) {
      that.showTopTips('安全令名称输入有误，请修改后重新提交');
      return false
    }
    let url = app.apiUrl.authAddByServer;
    let token = wx.getStorageSync('skey')
    this.setData({
      loading: true,
      disabled: true,
      addAuthButtonString: "添加安全令中"
    })
    wx.request({
      url: url,
      data: {
        authName: e.detail.value.authname,
        region: that.data.regionIndex,
        selectPic: that.data.authPicArray[that.data.selectAuthPic].id,
        defaultAuthSet: that.data.setDefaultAuth == true ? "on" : "",
        token_wechat_session_v1: token
      },
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        switch (res.data.code) {
          case 200:
            hasAddAuthSuccess = true;
            that.setData({
              loading: false,
              disabled: false,
              addAuthButtonString: "添加安全令成功"
            })
            wx.setStorageSync(
              "authCount", res.data.data.authCount
            )
            wx.setStorageSync(
              "canAddMoreAuth", res.data.data.canAddMoreAuth
            )
            setTimeout(function () {
              if (res.data.data.isDefault) {
                wx.redirectTo({
                  url: '/pages/index/index'
                })
              } else {
                wx.redirectTo({
                  url: '/pages/index/index?authId=' + res.data.data.authId
                })
              }
            }, 1500);
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
            that.setData({
              loading: false,
              disabled: false,
              addAuthButtonString: "添加失败"
            })
            return;
            break;
          default:
            that.setData({
              loading: false,
              disabled: false,
              addAuthButtonString: "添加安全令"
            })
            that.showTopTips(res.data.message);
            break;
        }
      },
      fail: function (e) {
        that.setData({
          loading: false,
          disabled: false,
          addAuthButtonString: "添加安全令"
        })
        that.showTopTips("添加失败，请检查网络连接是否正常");
      }
    })
  },
  addByRestore: function () {
    wx.redirectTo({
      url: '/pages/auth/addAuthByRestore/addAuthByRestore',
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