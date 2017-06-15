Page({
    data: {   
        plain:true,   
        isAgree: true,
        getCodeBtnProperty: {
          titileColor: '#B4B4B4',
          disabled: false,
        },
        getCodeParams: {  
          phoneNumber: '',
          code:''
        },
        inputCode:'',
        loginBtnDisabled:true
    },
    onLoad:function(){
    },
    
    //输入手机号
    phoneInput: function(e) {
        var that = this
        var inputValue = e.detail.value
        var length = e.detail.value.length
        if (length == 11) {
          //给接口的mobile参数赋值,以及改变获取验证码的状态
          that.setData({
            'getCodeParams.phoneNumber': inputValue,
            'getCodeBtnProperty.titileColor':'#1AAD19',
            'getCodeBtnProperty.disabled': false
          })
        }else {
          //给接口的mobile参数赋值,以及改变获取验证码的状态
          that.setData({
            'getCodeBtnProperty.titileColor':'#B4B4B4',
          })
        }
    },
    //输入验证码
    codeInput: function(e) {
        var that = this
        var inputValue = e.detail.value
        var length = e.detail.value.length
        if (length == 6) {
          //给接口的mobile参数赋值,以及改变获取验证码的状态
          // console.log(e.detail.value);
          that.setData({
            inputCode: inputValue,
            loginBtnDisabled:false
          })
        }else{
            that.setData({          
            loginBtnDisabled:true
          })
        }
    },
    getCode:function(){
        var that=this
        var phoneNumber=that.data.getCodeParams.phoneNumber       
        wx.request({
            url: 'http://arget.com.cn/diandongche/user/getCode',
            data: {
              phoneNumber:phoneNumber
            },
            method: 'GET', 
            header: {
            'content-type': 'application/json'
            },
            success: function(res){
                console.log(res)
                if (res.data) {
                    wx.showToast({
                      title: '请注意查收！',
                      icon: 'success',
                      duration: 2000,
                    })
                    that.setData({
                        'getCodeParams.code':res.data
                    })
                }
            }, 
            fail:function(res){

            }
        })
    },
    confirm:function(){
        var that=this
        // console.log(that.data.inputCode);
        if (that.data.inputCode==that.data.getCodeParams.code) {
            wx.setStorageSync('token', that.data.getCodeParams.phoneNumber)
            wx.showToast({
              title: '登录成功！跳转中...',
              icon: 'success',
              duration: 1000,
            })
            wx.redirectTo({
              url: '../member/member'
            })
 
        }else{
            wx.showToast({
              title: '验证码错误！',
              icon: 'success',
              duration: 2000,
            })
            // wx.navigateTo({
            //     url: '../member/member'
            // })
        }

    }    
});