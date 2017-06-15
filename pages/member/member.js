// pages/member/member.js
Page({
  onShareAppMessage: function () {
    return {
      title: '51get共享电动车',
      path: '/pages/index/index',     
    }
  } ,
  data:{
    shareBtnplain:true,
    userinfo:null,
    userinfoSys:null,
    vertify:'未实名认证',
     steps: [
      {
        current: false,
        done: true,
        text: '手机认证',       
      },
      {
        done: true,
        current: true,
        text: '实名认证',      
      },
      {
        done: false,
        current: false,
        text: '保证金充值',        
      },
      {
        done: false,
        current: false,
        text: '注册完成',     
      }
    ],
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userinfo:res.userInfo
              })             
            }
          })
        }
      })
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that=this
    var username=wx.getStorageSync('token')
    console.log(username)
    wx.request({
      url: 'http://arget.com.cn/diandongche/user/login', //仅为示例，并非真实的接口地址
      data: {
        username:username
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          userinfoSys:res.data
        })
        wx.setStorageSync('userInfo',res.data)
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  //跳转钱包
  inWallet:function(){
    wx.vibrateShort()//震动
      wx.navigateTo({
          url: '../wallet/wallet'
      })
  },

  //跳转我的行程
  inRoad:function(){
    wx.vibrateShort()//震动
    wx.navigateTo({
        url: '../route/route'
    })
  },

  //联系客户
  inKefu:function(){
    wx.vibrateShort()//震动
    wx.makePhoneCall({
      phoneNumber: '18352860045' //仅为示例，并非真实的电话号码
    })
  },

  //跳转设置
  inSuggest:function(){
    wx.vibrateShort()//震动
    wx.navigateTo({
          url: '../suggest/suggest'
      })
  },
    //跳转设置
  inAbout:function(){
    wx.vibrateShort()//震动
    wx.navigateTo({
          url: '../about/about'
      })
  },
  inInfo:function(){
    wx.vibrateShort()//震动
    wx.navigateTo({
          url: '../info/info'
      })
  },
   
})