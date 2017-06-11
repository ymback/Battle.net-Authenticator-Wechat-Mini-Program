// authList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: true,
    show2: true,
    show3: true,
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

  longTapEvent: function (e) {
      let that = this;
      wx.showModal({
          title: '确认删除？',
          content: '删除本安全令',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                      show1: false
                  })

              } else if (res.cancel) {
                  console.log('用户点击取消')
              }
          }
      });
  }
})