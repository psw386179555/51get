//index.js
//获取应用实例
var app = getApp();
var URL = app.globalData.siteUrl;
Page({
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    mapScale: 18,
    latitude: '',
    longitude: '',
    markers: [],
    controls: []

  },
  onLoad: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getCarList(res.latitude, res.longitude)
      }
    })

  },
  onReady: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
  onShow: function () {
    var that = this
    var deviceMac = wx.getStorageSync('deviceMac') || ''
    if (deviceMac.length > 0) {
      that.setData({
        controls: [
          {
            id: 2,//定位中心
            iconPath: '/img/imgs_main_location@2x.png',
            position: {
              left: 10,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 40,
              height: 40
            },
            clickable: true,
          }, {
            id: 3,//用户中心
            iconPath: '/img/member.png',
            position: {
              left: wx.getSystemInfoSync().windowWidth - 50,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 40,
              height: 40
            },
            clickable: true,
          }, {
            id: 6,//kongzhi
            iconPath: '/img/controll.png',
            position: {
              left: 0.5 * wx.getSystemInfoSync().windowWidth - 100,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 200,
              height: 40
            },
            clickable: true,
          }
        ]
      })
    } else {
      that.setData({
        controls: [
          {
            id: 2,//定位中心
            iconPath: '/img/imgs_main_location@2x.png',
            position: {
              left: 10,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 40,
              height: 40
            },
            clickable: true,
          }, {
            id: 3,//用户中心
            iconPath: '/img/member.png',
            position: {
              left: wx.getSystemInfoSync().windowWidth - 50,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 40,
              height: 40
            },
            clickable: true,
          }, {
            id: 5,//扫码
            iconPath: '/img/scan.png',
            position: {
              left: 0.5 * wx.getSystemInfoSync().windowWidth - 100,
              top: 0.85 * wx.getSystemInfoSync().windowHeight + 20,
              width: 200,
              height: 40
            },
            clickable: true,
          }
        ]
      })
    }
    setTimeout(function () {
      that.getUserCurrentLocation()
    }, 500)
  },
  regionchange: function (e) {
    //得到地图中心点的位置
    var that = this
    that.mapCtx = wx.createMapContext('map')
    that.mapCtx.getCenterLocation({
      success: function (res) {
        //调试发现地图在滑动屏幕开始和结束的时候都会走这个方法,需要判断位置是否真的变化来判断是否刷新单车列表
        //经纬度保留6位小数
        var longitudeFix = res.longitude.toFixed(6)
        var latitudeFix = res.latitude.toFixed(6)
        if (e.type == "begin") {
          // console.log('位置相同,不执行刷新操作')
        } else {
          // console.log("位置变化了")
        }
      }
    })
  },
  //获取移动到用户位置
  getUserCurrentLocation: function () {
    var that = this
    that.mapCtx = wx.createMapContext('map')
    that.mapCtx.moveToLocation();
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    var that = this
    // console.log(e.controlId)
    var id = e.controlId
    if (id == 2) {
      //定位当前位置
      that.getUserCurrentLocation()
      that.setData({
        mapScale: 18
      })
    } else if (id == 3) {
      var token = wx.getStorageSync('token') || ''
      if (token.length > 0) {
        //进入钱包
        wx.navigateTo({
          url: '../member/member'
        })
      } else {
        //登录 
        wx.navigateTo({
          url: '../login/login'
        })
      }
    } else if (id == 5) {
      var token = wx.getStorageSync('token') || ''
      if (token.length > 0) {
        //调起扫码
        wx.scanCode({
          onlyFromCamera: true,
          success: function (res) {
            // success 
            // console.log(res)
            // 扫码之后请求接口
            wx.navigateTo({
              url: '../controll/controll?deviceMac=' + res.result
            })
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '扫码失败',
              icon: 'loading',
              duration: 2000,
            })
          },
          complete: function () {
            // complete
          }
        })
      } else {
        //登录 
        wx.navigateTo({
          url: '../login/login'
        })
      }
    } else if (id == 6) {
      var deviceMac = wx.getStorageSync('deviceMac')
      wx.navigateTo({
        url: '../controll/controll?deviceMac=' + deviceMac
      })
    }
  },
  checkCarUse: function (latitude, longitude) {
    var that = this;
    var carInfo = wx.getStorageSync('deviceMac') || ''
  },
  getCarList: function (latitude, longitude) {
    var that = this
    var markers = new Array()
    wx.request({
      url: URL + 'diandongche/car/getCarStates',
      data: {
        carState: 0
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = res.data.length - 1; i >= 0; i--) {
          res.data[i].carX = latitude - 0.01 * Math.random()
          res.data[i].carY = longitude + 0.01 * Math.random()
          var a = {
            iconPath: "/img/carlist.png",
            title: res.data[i].carName,
            id: res.data[i].carId,
            latitude: res.data[i].carX,
            longitude: res.data[i].carY,
            width: 35,
            height: 40,
            callout: {
              content: '车牌号:' + res.data[i].carName,
              color: '#a4d5f6',
              fontSize: 16,
              borderRadius: 13,
              bgColor: '#3A4750',
              padding: 5,
              display: 'BYCLICK',
            }
          }
          markers = markers.concat(a)
        }
        // console.log(markers);
        that.setData({
          markers: markers
        })
      }
    })
  }
})
