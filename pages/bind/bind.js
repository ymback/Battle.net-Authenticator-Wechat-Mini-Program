// bind.js
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
    token:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  /**
   * setattr
   */
  click:function(e)
  {
    this.setData({
      loading: true
    })
  },
  register:function (e) {
      wx.showToast({
          title: '跳转',
          icon: 'loading'
      })
      wx.redirectTo({
          url: '/pages/register/register'
      })
  },
  formSubmit:function(e){
    let url = "http://myauth.zuzhanghao.com/api/wechat/bindAccount ";
    let token = wx.getStorageSync('skey')
    for (var key in e.detail.value)
    {
      if (e.detail.value[key] == '')
      {
          wx.showToast({
            title: '错误,输入值不能为空',
            icon: 'loading',
            duration: 2000
          })
          this.setData({
              loading: false
          })
          return false
      }
    }
      wx.request({
          url: url,
          data: {
              username: e.detail.value.username,
              password: e.detail.value.password,
              token_wechat_session_v1:token
          },
          header: {},
          method: 'post',
          dataType: '',
          success: function(res)
          {
              if(res.date.code == 200)
              {
                  wx.redirectTo({
                      url: '/pages/index/index',
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
                  })
              }
          }
      })
  }
})