// pages/collect/collect.js      
import Dialog from '../../wxcomponents/vant/dialog/dialog';  
import Toast from '../../wxcomponents/vant/toast/toast';
let app = getApp().globalData;                     
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collects:[],
    isLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onClose(event) {
    let id = event.currentTarget.dataset.id
    Dialog.confirm({
      title: '内容',
      message: '你确定要取消收藏吗',
    })
      .then(() => {
        this.cancleCollect(id)
      })
      .catch(() => {
        Toast('取消删除收藏')
      });
  },

  // 获取收藏商品信息
  async getCollect(){
    let res = await app.request({url:app.base.getCollect,data:null,method:'get'})
    let data = res.data.result
    console.log(data);
    let arr = this.data.collects
    data.forEach(item=>{
      arr.push({
        id:item.product_id,
        name:item.product_title,
        price:item.product_price,
        img:JSON.parse(item.product_image)[0],
        desc:item.product_desc,
        address:item.product_address,
        collected:item.is_collect
      })
    })
    this.setData({
      collects:arr
    })
  },

  // 取消收藏
  async cancleCollect(params){
    let res = await app.request({url:app.base.changeCollect,data:{id:params,state:false},method:'get'})
    if(res.statusCode === 200){
      Toast('取消收藏成功')
      this.onShow()
    }
  },


  onLoad(options) {
    let user = wx.getStorageSync('user');
    if(user){
      this.setData({
        isLogin:true
      })
    }else{
      this.setData({
        isLogin:true
      })
    }
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
    this.setData({
      collects:[]
    })
    this.getCollect()
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