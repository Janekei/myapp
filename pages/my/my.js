// 导入util封装的方法
import Dialog from '../../wxcomponents/vant/dialog/dialog';
let app =  getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      isLogin:false,
      userInfo:{},
      uid:''
  },
  gotoPerson(){
    let uid = this.data.uid
    wx.navigateTo({
      url:'../../pages/personal/personal',
      success:result =>{
        result.eventChannel.emit('personInfo',uid)
      },
      fail:() =>{console.log('错误')}
    });
  },
  getUser(){
    wx.getUserProfile({
      lang:'zh_CN',
      desc:'desc',
      success:res=>{
        // console.log('111111',res);
        // 使用对象解构保存用到的信息
        const {encryptedData,iv} = res
        const that = this
        // login()方法获取登录凭证，通过凭证换取用户的登录状态信息
        // 当前小程序唯一标识openid-----本次登录会话密钥session_key
        wx.showLoading({title: '登录中', icon: 'loading', mask: true})
        wx.login({
          success:res=>{
            app.request({
              url:app.base.userInfo,
              data:{
                code:res.code,
                iv,
                encryptedData
              },
              method:'GET'
            }).then(res=>{
              let result = res.data.decodeData
              console.log(result);
              //存储到内存
              wx.setStorageSync('user',result)
              this.setData({
                userInfo:result,
                isLogin:true
                });
              wx.hideLoading()
            })
          }
        })
      }
    })
  },
  // 退出登录---清楚本地缓存
  loginOut(){
    Dialog.confirm({
      title: '退出登录',
      message: '您确定要退出登录吗',
    })
      .then(() => {
        // 确认退出
      this.setData({
        userInfo:{},
        isLogin:false
      })
      wx.removeStorageSync('user')
      })
      .catch(() => {
        // on cancel
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面一加载进来就获取存储到的用户信息
    let user = wx.getStorageSync('user');
    if(user){
      console.log('1111');
      this.setData({
        userInfo:user,
        isLogin:true
      })
    }
    this.setData({
      uid:user.watermark.appid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})