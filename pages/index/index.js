//index.js
//获取应用实例
var app = getApp()
Page({
    data:{
        progress:0
    },
    onLoad:function(){
        var that = this
        var inter = setInterval(function(){
            if (that.data.progress >= 100) {
                clearInterval(inter);
            }
            that.setData({
                progress:that.data.progress + 10
            });
        },1000);
    }
})
