//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (!wx.canIUse("button.open-type.getUserInfo")) {
      this.getUserInfo
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    intentAuthInfo: null,
    userInfo: null,
    needReloadAuthList: false,
    deletedAuthNeedRefreshIndex: false
  },
  apiUrl: {
    baseUrl: "https://myauth.us",
    getSessionToken: "https://myauth.us/api/wechat/getSessionToken",
    authDynamicCode: "https://myauth.us/api/wechat/authDynamicCode",
    authCount: "https://myauth.us/api/wechat/authCount",
    getSessionToken: "https://myauth.us/api/wechat/getSessionToken",
    getOneButtonAuthRequestInfo: "https://myauth.us/api/wechat/getOneButtonAuthRequestInfo",
    commitOneKeyButtonAuthResponse: "https://myauth.us/api/wechat/commitOneKeyButtonAuthResponse",
    bindAccount: "https://myauth.us/api/wechat/bindAccount",
    register: "https://myauth.us/api/wechat/register",
    authAddByServer: "https://myauth.us/api/wechat/authAddByServer",
    authAddByRestoreCode: "https://myauth.us/api/wechat/authAddByRestoreCode",
    userInfo: "https://myauth.us/api/wechat/userInfo",
    unBind: "https://myauth.us/api/wechat/unBind",
    authList: "https://myauth.us/api/wechat/authList",
    authInfo: "https://myauth.us/api/wechat/authInfo",
    authDelete: "https://myauth.us/api/wechat/authDelete",
  }
})