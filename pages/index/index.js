//index.js
//获取应用实例
var app = getApp()
Page({
    data:{
        progress:0
    },
    onLoad:function(){
        wx.setNavigationBarTitle({
            title: '我的安全令'
        })

        var that = this
        var inter = setInterval(function(){
            if (that.data.progress >= 100) {
                that.setData({
                    progress:0
                });
            }
            that.setData({
                progress:that.data.progress + 10
            });
        },1000);
        wx.getStorage({
          key: 'skey',
          success: function (res) {
            console.log(res.data)
          }
        })
        wx.checkSession({
          success: function(res) 
          {
            console.log(res)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
    }
})
