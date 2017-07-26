// register.js
var app = getApp();
var registerSuccess = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['您出生的城市是哪里?', '您手机的型号是什么?', '您就读的第一所小学名称是?', '您的初恋情人叫什么名字?',
      '您驾照的末四位是什么?', '您母亲的姓名叫什么?', '您母亲的生日是哪一天?', '您父亲的生日是哪一天?'],
    questionArray: [
      {
        id: 0,
        name: '请选择一个密保问题'
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
        name: '您父亲的生日是哪一天?'
      }
    ],
    index: 0,
    selectQuestion: "请选择一个密保问题",
    selectQuestionId: 0,
    date: '2016-09-01',
    time: '12:01',
    errorString: '',
    showTopTips: false,
    loading: false,
    disabled: false,
    questionPickerClass: "weui-input placeholder-class",
    registerButtonString: "注册",
    wechatNickname: null
  },

  onLoad: function (options) {
    registerSuccess = false;
    var that = this;
    wx.setNavigationBarTitle({
      title: '注册新账号'
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          wechatNickname: userInfo.nickName
        })
      }
    })
  },
  bind: function () {
    if (registerSuccess){
      return;
    }
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var newQuestionName = this.data.questionArray[parseInt(e.detail.value) + 1].name;
    var newQuestionId = this.data.questionArray[parseInt(e.detail.value) + 1].id;
    this.setData({
      index: parseInt(e.detail.value),
      selectQuestionId: newQuestionId,
      selectQuestion: newQuestionName,
      questionPickerClass: "weui-input"
    })
    console.log('选择的问题', this.data.selectQuestionId)
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  formSubmit: function (e) {
    if (registerSuccess) {
      return
    }
    var that = this;
    let url = app.apiUrl.register;
    let json = {};
    let token = wx.getStorageSync('skey')
    for (var key in e.detail.value) {
      if (e.detail.value[key] == '') {
        switch (key) {
          case 'username':
            that.showTopTips('输入的账号不能为空');
            break;
          case 'password':
            that.showTopTips('输入的密码不能为空');
            break;
          case 'passwordToo':
            that.showTopTips('输入的密码确认不能为空');
            break;
          case 'email':
            that.showTopTips('输入的邮箱地址不能为空');
            break;
          case 'answer':
            that.showTopTips('输入的密保答案不能为空');
            break;
          default:
            that.showTopTips('输入项不能为空');
            break;
        }
        return false
      }
    }
    if (that.data.selectQuestionId < 81 || that.data.selectQuestionId > 88) {
      that.showTopTips('请选择密保问题');
      return false
    }
    let usernameReg = /^[\u4e00-\u9fa5A-z0-9_]{1,32}$/;
    if (!usernameReg.test(e.detail.value.username)) {
      that.showTopTips('用户名包含特殊字符，请修改后重新提交');
      return false
    }
    let passwordReg = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*).{8,16}$/;
    if (!passwordReg.test(e.detail.value.password)) {
      that.showTopTips('密码必须为8-16位，包含字母和数字');
      return false
    }
    if (e.detail.value.password != e.detail.value.passwordToo) {
      that.showTopTips('两次输入的密码不一致，请检查后重新提交');
      return false
    }

    let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!emailReg.test(e.detail.value.email)) {
      that.showTopTips('邮箱格式不正确，请修改后重新提交');
      return false
    }
    json['username'] = e.detail.value.username;
    json['password'] = e.detail.value.password;
    json['question'] = this.data.selectQuestionId;
    json['answer'] = e.detail.value.answer;
    json['email'] = e.detail.value.email;
    json['token_wechat_session_v1'] = token;
    json['wechatNickname'] = this.data.wechatNickname;
    this.setData({
      loading: true,
      disabled: true,
      registerButtonString: "注册中"
    })
    wx.request({
      url: url,
      data: json,
      header: {},
      method: 'post',
      dataType: '',
      success: function (res) {
        if (res.data.code == 200) {
          registerSuccess = true;
          wx.setStorageSync(
            "canAddMoreAuth", true
          )
          wx.setStorageSync(
            "userName", res.data.data.userName
          )
          wx.setStorageSync(
            "authCount", 0
          )
          that.setData({
            loading: false,
            disabled: false,
            registerButtonString: "注册成功"
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          that.setData({
            loading: false,
            disabled: false,
            registerButtonString: "注册"
          })
          that.showTopTips(res.data.message)
        }
      },
      fail: function () {
        that.setData({
          loading: false,
          disabled: false,
          registerButtonString: "注册"
        })
        wx.hideLoading()
        that.showTopTips('注册失败，请重试');
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
  }
})