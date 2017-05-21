// register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      array: ['选择一个安全提问问题', '您出生的城市是哪里?', '您手机的型号是什么?', '您就读的第一所小学名称是?','您的初恋情人叫什么名字?','您驾照的末四位是什么?','您母亲的姓名叫什么?','您母亲的生日是哪一天?','您父亲的生日是哪一天?'],
      objectArray: [

          {
              id: 0,
              name: '选择一个安全提问问题'
          },
          {
              id: 81,
              name: '您出生的城市是哪里?'
          },
          {
              id: 82,
              name: '您手机的型号是什么?'
          },
          {
              id: 83,
              name: '您就读的第一所小学名称是?'
          },
          {
              id: 84,
              name: '您的初恋情人叫什么名字?'
          },
          {
              id: 85,
              name: '您驾照的末四位是什么?'
          },
          {
              id: 86,
              name: '您母亲的姓名叫什么?'
          },
          {
              id: 87,
              name: '您母亲的生日是哪一天?'
          },
          {
              id: 88,
              name: '日您父亲的生日是哪一天?本'
          }
      ],
      index: 0,
      date: '2016-09-01',
      time: '12:01'
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
  bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          index: e.detail.value
      })
  },
  bindDateChange: function(e) {
      this.setData({
          date: e.detail.value
      })
  },
  bindTimeChange: function(e) {
      this.setData({
          time: e.detail.value
      })
  },
    formSubmit:function(e){
        let url = "http://myauth.zuzhanghao.com/api/wechat/register ";
        let json = {};
        let token = wx.getStorageSync('skey')
        for (var key in e.detail.value)
        {
            if (e.detail.value[key] == '')
            {
                wx.showToast({
                    title: '错误,输入值不能为空',
                    icon: 'loading'
                })
                return false
            }
        }
        let usernameReg = /^[0-9a-zA-Z]*$/g;
        if (!usernameReg.test(e.detail.value.username))
        {
            wx.showToast({
                title: '非法的用户名',
                icon: 'loading'
            })
            return false
        }
        let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!emailReg.test(e.detail.value.email))
        {
            wx.showToast({
                title: '非法的邮箱',
                icon: 'loading'
            })
            return false
        }

        if (e.detail.value.password != e.detail.value.passwordToo)
        {
            wx.showToast({
                title: '错误,两次输入的密码不一致',
                icon: 'loading'
            })
            return false
        };
        if (this.data.objectArray[this.data.index].id == 0)
        {
            wx.showToast({
                title: '请选择密保问题',
                icon: 'loading'
            })
            return false
        }
        json['username'] = e.detail.value.username;
        json['password'] = e.detail.value.password;
        json['question'] = this.data.objectArray[this.data.index].id;
        json['answer'] = e.detail.value.answer;
        json['email'] = e.detail.value.email;
        json['token_wechat_session_v1'] = token;

        wx.request({
            url: url,
            data: json,
            header: {},
            method: 'post',
            dataType: '',
            success: function(res)
            {
                console.log(res)
            }
        })
    }
})