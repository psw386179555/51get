// pages/wallet/wallet.js
Page({
  data:{
    money:"100.00",
    changemoney:100
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  payChangeMoney:function(){
    var that=this
    var money=that.data.changemoney
    wx.showModal({
      title: '提示',
      content: '您选择充值'+money+'元',
      confirmText:'充值',
      cancelText:'取消',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://arget.com.cn/diandongche/user/insertCharge', //仅为示例，并非真实的接口地址
            data: {
              userId:wx.getStorageSync('userInfo').userid,
              userCharge:money      
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res)
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })          
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  giveMoney:function(){
    wx.showModal({
      title: '提示',
      content: '押金费用为199元，可退',
      confirmText:'支付',
      cancelText:'取消',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  inMoneyDetail:function(){
    wx.navigateTo({
        url: '../moneydetail/moneydetail'
    })
  },
  changeMoney:function(e){
    var that=this
    console.log(e);
    var money=e.currentTarget.dataset.money
    that.setData({
      changemoney:money
    })
  }
})