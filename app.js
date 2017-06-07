//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo
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
    userInfo: null
  },
  apiUrl: {
    getSessionToken: "https://myauth.zuzhanghao.com/api/wechat/getSessionToken",
    authDynamicCode: "https://myauth.zuzhanghao.com/api/wechat/authDynamicCode",
    authCount: "https://myauth.zuzhanghao.com/api/wechat/authCount",
    getSessionToken: "https://myauth.zuzhanghao.com/api/wechat/getSessionToken",
    getOneButtonAuthRequestInfo: "https://myauth.zuzhanghao.com/api/wechat/getOneButtonAuthRequestInfo",
    commitOneKeyButtonAuthResponse: "https://myauth.zuzhanghao.com/api/wechat/commitOneKeyButtonAuthResponse",
    bindAccount: "https://myauth.zuzhanghao.com/api/wechat/bindAccount",
    register: "https://myauth.zuzhanghao.com/api/wechat/register",
    authAddByServer: "https://myauth.zuzhanghao.com/api/wechat/authAddByServer",
    authAddByRestoreCode: "https://myauth.zuzhanghao.com/api/wechat/authAddByRestoreCode",
    userInfo: "https://myauth.zuzhanghao.com/api/wechat/userInfo",
    unBind: "https://myauth.zuzhanghao.com/api/wechat/unBind",
  }
})