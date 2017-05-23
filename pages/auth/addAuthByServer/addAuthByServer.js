// addAuthByServer.js
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
    array: ["CN", "US", "EU"],
    objectArray: [
      {
        id: 0,
        name: 'CN'
      },
      {
        id: 1,
        name: 'US'
      },
      {
        id: 2,
        name: 'EU'
      }
    ],
    index: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加安全令'
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
  formSubmit:function(e){
    let url = "http://myauth.zuzhanghao.com/api/wechat/authAddByServer ";
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
              authName: e.detail.value.username,
              region: this.data.objectArray[this.data.index].id,
              selectPic: 1,
              token_wechat_session_v1:token
          },
          header: {},
          method: 'post',
          dataType: '',
          success: function(res)
          {
              if(res.data.code == 200)
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
  },
  goToAddByRestore:function(){
    wx.redirectTo({
      url: '/pages/auth/addAuthByRestore/addAuthByRestore',
    })
  }
})