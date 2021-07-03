// pages/home.js
var appdata = getApp().globalData;
var reportTimer = 0; // 上报计时器
import {isStatus200} from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        "text": "首页",
        "iconPath": "/images/map_icon_default.png",
        "selectedIconPath": "/images/map_icon_active.png"
      },
      {
        "text": "设置",
        "iconPath": "/images/tabbar_icon_setting_default.png",
        "selectedIconPath": "/images/tabbar_icon_setting_active.png"
      }
    ],
    index: 0,
    my_latitude: 0, // 纬度
    my_longitude: 0, // 经度
    my_speed: 0, // 速度
    poi: [{ // 描绘的路径点
      points: [],
      width: 10,
      color: "#FA6400",
    }],
    switchStatus: 0, // 开关状态
    showRoad: 0,  // 显示路线
    // 加速度传感器数据
    acc_x: 0,
    acc_y: 0,
    acc_z: 0,
    alpha: 0, // [0, 360)。逆时针转动为正。
    beta: 0,  // 范围值为 [-90, 90) 。顶部朝着地球表面转动为正。
    gamma: 0, // 范围值为 [-180, 180)。右边朝着地球表面转动为正。
    acc_ground: 0,
    platform: "android",   // 使用平台
    bindAboutDialogShow: 0, // 关于我们对话框
    oneButton: [{text: '确定'}],
  },
  // tab切换
  tabChange(e) {
    console.log('tab change', e);
    this.setData({
      index: e.detail.index
    })
    if(e.detail.index==1){
      this.getRecordNum();
    }
  },
  // 显示路线
  showRoadChange:function (e) {
    this.setData({
      showRoad: e.detail.value
    });
    var myThis=this
    if(e.detail.value){
      // 请求数据
      wx.request({
        url: appdata.baseUrl + 'getroadmap',
        method: 'GET',
        success(response) {
          isStatus200(response.statusCode)
          console.log(response.data)
          myThis.setData({
            poi:response.data.polyline
          })
        }
      })
    }else{
      myThis.setData({
        poi:[]
      })
    }
  },
  // 开关切换
  switchChange: function (e) {
    console.log('switchChange', e);
    this.setData({
      switchStatus: e.detail.value
    });
    // 开启检测
    if (e.detail.value == 1) {
      var myThis = this;
      wx.startAccelerometer()
      wx.startDeviceMotionListening({
        interval:"ui"
      })

      // 开启方向监测
      wx.onDeviceMotionChange(function (res) {
        // IOS的角度是反的！！！
        if(myThis.data.platform=="ios"){
          myThis.setData({
            alpha: res.alpha,
            beta: -res.beta,
            gamma: -res.gamma
          })
        }else{
          myThis.setData({
            alpha: res.alpha,
            beta: res.beta,
            gamma: res.gamma
          })
        }
        
      });

      // 开启加速度传感器
      wx.onAccelerometerChange(function (res) {
        let beta= myThis.data.beta*Math.PI/180
        let gamma= myThis.data.gamma*Math.PI/180
        myThis.setData({
          acc_x: res.x,
          acc_y: res.y,
          acc_z: res.z,
          acc_ground: res.z*Math.cos(-beta)*Math.cos(gamma)+res.y*Math.sin(-beta)+res.x*Math.sin(gamma)
        })
      });

      // 开启gps获取
      wx.startLocationUpdate({
        success: function (res) {
          wx.onLocationChange(myThis.onLocationChangeCallback)
        }
      })
      // 启动上报
      this.startReport()
    } else {
      this.stopReport()
      wx.stopAccelerometer();
      wx.stopDeviceMotionListening();
      wx.stopLocationUpdate({
        success: (res) => {
          console.log("stopLocationUpdate")
        },
      })
    }
  },

  // 获取位置回调函数
  onLocationChangeCallback(res) {
    this.setData({
      my_latitude: res.latitude,
      my_longitude: res.longitude,
    })
  },
  // 初始化页面
  init() {
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res) => {
        this.setData({
          my_latitude: res.latitude,
          my_longitude: res.longitude,
          my_speed: res.speed
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();
      }
    });
  },
  // 开始上报
  startReport() {
    reportTimer = setTimeout(this.startReport, 500)
    this.uploadData()
  },
  // 停止上报
  stopReport() {
    clearTimeout(reportTimer)
  },
  // 上报传感器数据请求
  uploadData() {
    if(this.data.acc_x==0&&this.data.acc_y==0&&this.data.acc_z==0)return;
    if(appdata.userid==null){
      wx.showToast({
        title: '正在重新登录',
        icon: 'error',
        duration: 1000,
      })
      // 发生异常，停止上报
      this.setData({
        switchStatus: 0
      });
      this.stopReport()
      wx.stopAccelerometer();
      wx.stopDeviceMotionListening();
      wx.stopLocationUpdate({
        success: (res) => {
          console.log("stopLocationUpdate")
        },
      })
      this.onLoad();
    }
    var datafield = {
      longitude: this.data.my_longitude,
      latitude: this.data.my_latitude,
      speed: this.data.my_speed,
      acc_x: this.data.acc_x,
      acc_y: this.data.acc_y,
      acc_z: this.data.acc_z,
      acc_ground: this.data.acc_ground,
      userid: appdata.userid
    }
    wx.request({
      url: appdata.baseUrl + 'uploaddata',
      method: 'POST',
      data: {
        data: datafield
      },
      success(response) {
        isStatus200(response.statusCode)
        console.log(response.data)
      }
    })
  },
  // 关于我们
  tapBindAboutCell: function (e) {
    //窗口打开
    this.setData({
      bindAboutDialogShow: true,
    })
  },
  tapBindAboutDialogButton: function (e) {
    //窗口关闭
    this.setData({
      bindAboutDialogShow: false,
    })
  },
  // 获取用户贡献数据
  getRecordNum: function (e) {
    var myThis=this
    wx.request({
      url: appdata.baseUrl + 'getuserrecordnum',
      data:{
        userid: appdata.userid
      },
      method: 'GET',
      success(response) {
        isStatus200(response.statusCode)
        console.log("getuserrecordnum", response.data)
        myThis.setData({
          userRecordNum:response.data.num
        })
      }
    })
    
    this.setData({
      bindAboutDialogShow: false,
    })
  },
  /**************************************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();

    var that = this;

    // 判断安卓还是IOS
    wx.getSystemInfo({
      success (res) {
        console.log(res.platform)
        that.setData({
          platform: res.platform
        })
      }
    })
    wx.login({
      success: res => {
        // console.log(res)
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: appdata.baseUrl + 'login',
            data: {
              code: res.code
            },
            success(response) {
              isStatus200(response.statusCode)
              console.log(response.data)
              appdata.userid = response.data.openid
              that.init()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
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

  }
})