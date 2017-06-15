// pages/control/control.js
var utils = require('../../utils/util.js')
var app = getApp();
var URL = app.globalData.siteUrl;
Page({
  data: {
    carbluetooth: {
      deviceMac: null,
      deviceName: null,
      deviceId: null,
      serviceId: null,
      advertisServiceId: null,
      writecharacteristicId: null,
      readcharacteristicId: null,
      notifycharacteristicId: null
    },
    carinfo: {
      carId: null,
      carName: null,
      carNumber: null,
      battery: null,
      state: null,
      carStime: null,
      carUseTime: null,
    }
  },
  onLoad: function (options) {
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options);
    // wx.showLoading({
    //   title: '正在连接设备...',  
    // })  
    // wx.startBluetoothDevicesDiscovery({
    //     success: function (res) {
    //         console.log("开始搜索附近蓝牙设备")
    //         console.log(res)
    //     }
    // })
    var deviceMac = options.deviceMac = "E899B6C8A9B9000000001036"
    wx.setStorageSync('deviceName', deviceName)
    wx.request({
      url: URL + 'diandongche/car/getCarByMac', //仅为示例，并非真实的接口地址
      data: {
        carMac: deviceMac
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        that.setData({
          [`carinfo.carNumber`]: res.data.carNum,
          [`carinfo.carName`]: res.data.carName,
          [`carinfo.carId`]: res.data.carId,
          [`carinfo.state`]: res.data.carState
        })
      }
    })
    // var deviceName='WX:'+deviceMac.substring(0,12);
    var deviceName = 'iPhone';
    wx.setStorageSync('deviceName', deviceName)
    // console.log(deviceName)

    that.setData({
      [`carbluetooth.deviceMac`]: deviceMac,
      [`carbluetooth.deviceName`]: deviceName
    })
    //初始化蓝牙
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
        //检查蓝牙适配情况
        that.checkbluetooth()
        //监听蓝牙适配
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log("蓝牙适配器状态变化", res)
        })
        //监听蓝牙搜索
        wx.onBluetoothDeviceFound(function (devices) {
          console.log(devices)
          if (!deviceName) {
            deviceName = wx.getStorageSync('deviceName')
          }
          //机型为ios
          if (wx.getStorageSync('platform') == 'ios') {
            // 判断配对设备
            // if (deviceName == devices.devices[0].name) {
            if (devices.devices[0].deviceId == devices.devices[0].deviceId) {

              //获取设备id
              that.setData({
                [`carbluetooth.deviceId`]: devices.devices[0].deviceId
              })
              // 获取设备广播服务id
              // if (devices.devices[0].advertisServiceUUIDs[0]) {
              //   that.setData({
              //     [`carbluetooth.advertisServiceId`]: devices.devices[0].advertisServiceUUIDs[0]
              //   })
              // }
              console.log(devices.devices[0].deviceId);

              // 连接设备
              that.connectTO(devices.devices[0].deviceId)
            }
            //机型为Android
          } else if (wx.getStorageSync('platform') == 'android') {
            if (deviceName == devices.name) {
              that.setData({
                [`carbluetooth.deviceId`]: devices.deviceId
              })
              if (devices.advertisServiceUUIDs[0]) {
                that.setData({
                  [`carbluetooth.advertisServiceId`]: devices.advertisServiceUUIDs[0]
                })
              }
              that.connectTO(devices.deviceId)
            }
          }
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '请开启蓝牙重试！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // wx.navigateBack({
              //   delta: 1
              // })
            }
          }
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
    var deviceMac = "E899B6C8A9B9000000001036"
    var that = this
    var X = 50;
    var Y = 50;
    var R = 40;
    var battery;
    wx.request({
      url: URL + 'diandongche/car/getGps', //仅为示例，并非真实的接口地址
      data: {
        id: deviceMac
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        battery = (res.data.carBattery2) * 0.01
        // console.log(battery);
        if (battery <= 0.3) {
          var color = 'red'
        } else {
          var color = 'green'
        }
        var loadBattery = 1
        var cha = 1 / 3 / 20
        var time = setInterval(function () {
          var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
          cxt_arc.setLineWidth(10);
          cxt_arc.setStrokeStyle('#D3D3D3');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径 
          cxt_arc.arc(X, Y, R, 0, -Math.PI * 2, true);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.setLineWidth(10);
          cxt_arc.setStrokeStyle(color);
          cxt_arc.setFontSize(16);//设置填充文本字体的大小
          // cxt_arc.setFontStyle('#ffffff');//设置填充文本字体的大小
          cxt_arc.fillText('剩余电量\n    ' + battery * 100, 18, 55);
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径 
          cxt_arc.arc(X, Y, R, 0, Math.PI * 2 * loadBattery, false);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.draw();
          if (loadBattery <= battery) {
            clearInterval(time)
          }
          loadBattery = loadBattery - cha
        }, 50)
      }
    })

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


  controllConn: function () {
    wx.vibrateShort()//震动
    var that = this
    wx.showLoading({
      title: '正在连接设备...',
    })
    //搜索设备
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("开始搜索附近蓝牙设备")
        console.log(res)
      }
    })
  },

  //启动车
  controllStart: function () {
    var that = this

    wx.vibrateShort()//震动
    // util.setSteps(that,1)
    that.setData({
      [`carinfo.carStime`]: utils.formatTime(new Date)
    })
    wx.showLoading({
      title: '启动中...',
    })
    wx.request({
      url: URL + 'diandongche/car/getdeviceId', //仅为示例，并非真实的接口地址
      data: {
        deviceId: that.data.carbluetooth.deviceMac,
        type: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        var deviceId = that.data.carbluetooth.deviceId
        var serviceId = that.data.carbluetooth.serviceId
        var writecharacteristicId = that.data.carbluetooth.writecharacteristicId
        var readcharacteristicId = that.data.carbluetooth.readcharacteristicId
        var notifycharacteristicId = that.data.carbluetooth.notifycharacteristicId
        that.writebluetooth(deviceId, serviceId, writecharacteristicId, res.data)

        // 启动，将车信息存入缓存
        wx.setStorageSync('deviceMac', that.data.carbluetooth.deviceMac)

        //改变数据库车状态
        setTimeout(function () {
          that.changeCarStatus(that.data.carinfo.carId, 1)
        }, 500)

      }
    })
  },

  //  //锁车
  controllLock: function () {
    var that = this
    wx.vibrateShort()
    // util.setSteps(that,2)
    wx.showModal({
      title: '提示',
      content: '请长按车锁，熄灭后点击确认！',
      success: function (res) {
        if (res.confirm) {
          // if (1) {
          if (that.data.carinfo.state == 1) {
            wx.showToast({
              title: '锁车成功！',
              icon: 'success',
              duration: 2000
            })
            //改变数据库车状态
            setTimeout(function () {
              that.changeCarStatus(that.data.carinfo.carId, 1)
            }, 500)
          } else {
            wx.showToast({
              title: '锁车失败，请重试！',
              icon: 'success',
              duration: 2000
            })
          }
        } else if (res.confirm) {

        }
      }
    })
  },


  //还车
  controllRet: function () {
    wx.removeStorageSync('deviceMac')
    var that = this
    wx.vibrateShort()
    // util.setSteps(that,3) 
    wx.showModal({
      title: '提示',
      content: '请长按车锁，熄灭后点击确认！',
      success: function (res) {
        if (res.confirm) {
          // if (1) {            
          if (that.data.carinfo.state == 0) {
            wx.request({
              url: URL + 'diandongche/car/updateCar', //仅为示例，并非真实的接口地址
              data: {
                carId: that.data.carinfo.carId,
                carState: 0
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
                that.setData({
                  [`carinfo.state`]: 0
                })
                wx.showToast({
                  title: '还车成功！',
                  icon: 'success',
                  duration: 2000
                })
                wx.removeStorageSync('deviceMac')
              }
            })
          }
        } else if (res.confirm) {

        }
      }
    })
  },
  //搜索附近蓝牙设备
  searchbluetooth: function () {
    var that = this
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("开始搜索附近蓝牙设备")
        console.log(res)
      }
    })
  },

  //连接设备
  connectTO: function (deviceId) {
    // console.log(deviceId)
    var that = this
    that.stopsearch()//找到相应设备停止搜索，减少内存消耗 
    wx.createBLEConnection({//建立链接
      deviceId: deviceId,
      success: function (res) {
        wx.onBLEConnectionStateChange(function (res) {
          console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
        })
        setTimeout(function () {
          that.getServices()
          setTimeout(function () {
            that.getCharacteristics()
            setTimeout(function () {
              if (that.data.carbluetooth.notifycharacteristicId) {
                that.startNotify()
              }
              wx.showToast({
                title: '连接设备成功',
                icon: 'success',
                duration: 2000
              })
            }, 1500)
          }, 1000)
        }, 500)
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '连接设备失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  //检查蓝牙是否适配
  checkbluetooth: function () {
    var that = this
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  getServices: function () {
    var that = this
    wx.getBLEDeviceServices({	//获取设备服务			 
      deviceId: that.data.carbluetooth.deviceId,
      success: function (res) {
        console.log('device services:', res.services)
        that.setData({
          [`carbluetooth.serviceId`]: res.services[0].uuid
        })
        return res.services[0].uuid
      }
    })
  },

  startNotify: function () {
    var that = this
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.carbluetooth.deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.carbluetooth.advertisServiceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: that.data.carbluetooth.notifycharacteristicId,
      success: function (res) {
        console.log(res);
      }
    })
  },

  getCharacteristics: function () {
    var that = this
    wx.getBLEDeviceCharacteristics({//获取各项服务的特征值			 
      deviceId: that.data.carbluetooth.deviceId,
      serviceId: that.data.carbluetooth.serviceId,
      success: function (res) {
        console.log(res);
        for (var i = res.characteristics.length - 1; i >= 0; i--) {
          // 获取相应允许特征值
          if (res.characteristics[i].properties.write) {
            that.setData({
              [`carbluetooth.writecharacteristicId`]: res.characteristics[i].uuid
            })
          }
          if (res.characteristics[i].properties.read) {
            that.setData({
              [`carbluetooth.readcharacteristicId`]: res.characteristics[i].uuid
            })
          }
          if (res.characteristics[i].properties.notify) {
            that.setData({
              [`carbluetooth.notifycharacteristicId`]: res.characteristics[i].uuid
            })
          }
        }
      }
    })
  },

  //停止搜索
  stopsearch: function () {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("停止蓝牙搜索")
        console.log(res)
      }
    })
  },
  // 关闭蓝牙连接
  closebluetooth: function () {
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log('关闭蓝牙连接')
        console.log(res)
      }
    })
  },
  //读蓝牙
  readbluetooth: function (deviceId, serviceId, characteristicId) {
    // 必须在这里的回调才能获取
    var that = this
    wx.onBLECharacteristicValueChange(function (characteristic) {//监听写入，返回状态
      console.log('write characteristic value changed:', characteristic)
      var characteristicValue = that.hexToArr(that.buf2hex(characteristic.value))
      console.log(characteristicValue);
    })
    console.log('读蓝牙');
    wx.readBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicId,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    })

  },

  //写蓝牙
  writebluetooth: function (deviceId, serviceId, characteristicId, bufferData) {
    var that = this
    var i = 1
    wx.onBLECharacteristicValueChange(function (characteristic) {//监听写入，返回状态
      // console.log('write characteristic value changed:', characteristic)                
      var characteristicValue = that.hexToArr(that.buf2hex(characteristic.value))
      var isOpen = characteristicValue[3]
      // console.log(characteristicValue) 
      if ((isOpen == 1) && (i == 1)) {
        i = 0
        wx.showToast({
          title: '启动成功！',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          [`carbluetooth.deviceId`]: characteristic.deviceId,
          [`carbluetooth.serviceId`]: characteristic.serviceId,
          [`carbluetooth.writecharacteristicId`]: characteristic.writecharacteristicId,
          [`carinfo.state`]: isOpen
        })
      }

      if ((isOpen == 0) && (i == 0)) {
        i = 1
        wx.showToast({
          title: '关闭成功！',
          icon: 'success',
          duration: 1000
        })
      }
      that.setData({
        [`carbluetooth.deviceId`]: characteristic.deviceId,
        [`carbluetooth.serviceId`]: characteristic.serviceId,
        [`carbluetooth.writecharacteristicId`]: characteristic.writecharacteristicId,
        [`carinfo.state`]: isOpen
      })
    })
    // 向蓝牙设备发送一个0x00的16进制数据
    console.log('写入蓝牙1');
    // console.log(bufferData);
    var bufferData1 = bufferData.substring(0, 40)
    var bufferData2 = bufferData.substring(40, 51)
    // console.log(bufferData1);
    // console.log(bufferData2);
    var hex = bufferData1
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    // console.log(typedArray)
    // console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
    var buffer1 = typedArray.buffer
    // console.log(buffer1.byteLength)
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicId,
      // 这里的value是ArrayBuffer类型
      value: buffer1,
      success: function (res) {
        // console.log(res)
      },
      fail: function (res) {
        // console.log(res);
      }
    })
    setTimeout(function () {
      console.log('写入蓝牙2');
      var hex = bufferData2
      var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }))
      // console.log(typedArray)
      // console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
      var buffer1 = typedArray.buffer
      // console.log(buffer1.byteLength) //字节长度

      wx.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: deviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: serviceId,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: characteristicId,
        // 这里的value是ArrayBuffer类型
        value: buffer1,
        success: function (res) {
          // console.log(res)
        },
        fail: function (res) {
          // console.log(res);
        }
      })
    }, 500)
    wx.showModal({
      title: '提示',
      content: '长按车按钮启动！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  // 改变车状态
  changeCarStatus: function (carId, carState) {
    var that = this
    wx.request({
      url: URL + 'diandongche/car/updateCar',
      data: {
        carId: carId,
        carState: carState
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 'ok') {
        } else {
          wx.showToast({
            title: '异常错误',
            icon: 'success',
            duration: 2000
          })
        }

      }
    })
  },

  //获取字节流变成字符串
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  //字符串变成字节数组
  hexToArr: function (hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    return typedArray
  },

})