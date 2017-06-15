// pages/steps/steps.js
var utils = require('../../utils/util.js')
var app=getApp();
var URL=app.globalData.siteUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    notify:{
      idcardName:null,
      idcardNum:null,
      idcardDisabled:true,
      stucardName:null,
      stucardNum:null,
      stucardPassword:null,
      stucardDisabled:true,    
    },
    steps: [
      {
        current: false,
        done: true,
        text: '手机认证',       
      },
      {
        done: false,
        current: false,
        text: '实名认证',      
      },
      {
        done: false,
        current: false,
        text: '一卡通认证',        
      },
      {
        done: false,
        current: false,
        text: '保证金充值',     
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // console.log(wx.getStorageSync('userInfo'));
    wx.request({
      url:URL+'diandongche/user/getUserbyId',
      data:{
        userid:wx.getStorageSync('userInfo').userid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          userInfo:res.data
        })

      }
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
  //学生证验证
  idcardNameInput:function(e){
    var that=this
    // console.log(e.detail.value);
    that.setData({
      [`notify.idcardName`]:e.detail.value
    })

  },
  idcardNumInput:function(e){
    var that=this
    // console.log(e.detail);
    that.setData({
      [`notify.idcardNum`]:e.detail.value
    })
    if (e.detail.cursor>=18) {
      that.setData({
        [`notify.idcardDisabled`]:false
      })
    }else{
        that.setData({
        [`notify.idcardDisabled`]:true
      })
    }
  },
  notifyIdcard:function(){
    var that=this
    if (that.data.notify.idcardName&&that.data.notify.idcardNum) {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 2000      
      })
      setTimeout(function(){
        that.setData({
          [`userInfo.userstate`]:1
        })
        utils.setSteps(that,1)
      },1000)
    }
  },

  // 一卡通验证
  stucardNameInput:function(e){
    var that=this
    // console.log(e.detail.value);
    that.setData({
      [`notify.stucardName`]:e.detail.value
    })

  },
  stucardNumInput:function(e){
    var that=this
    // console.log(e.detail);
    that.setData({
      [`notify.stucardNum`]:e.detail.value
    })
  },
  stucardpasswordInput:function(e){
    var that=this
    // console.log(e.detail.value);
    that.setData({
      [`notify.stucardPassword`]:e.detail.value
    })
    if (that.data.notify.stucardPassword.length>0) {
      that.setData({
        [`notify.stucardDisabled`]:false
      })
    }else{
      that.setData({
        [`notify.stucardDisabled`]:true
      })
    }
  },
  notifyStucard:function(){
    var that=this
    if (that.data.notify.idcardName&&that.data.notify.idcardNum) {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 2000      
      })
      setTimeout(function(){
        that.setData({
          [`userInfo.userstate`]:2
        })
        utils.setSteps(that,2)
      },1000)
    }
  },
  giveMoney:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '押金费用为200元，可退',
      confirmText:'支付',
      cancelText:'取消',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 2000      
          })
          setTimeout(function(){
          that.setData({
            [`userInfo.userstate`]:3
          })     
            utils.setSteps(that,3)
          },1000)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  finishNotify:function(){
    var that=this    
  }
})