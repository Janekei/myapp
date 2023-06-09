let app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImg: [
      '/static/1.jpg',
      '/static/2.jpg',
      '/static/3.jpg',
      '/static/4.jpg'
    ],
    productInfo:[],
    title:{
      sell:"出售商品",
      buy:"收购商品"
    },
    search_value:''
  },
  onChange(e){
    this.setData({
      search_value:e.detail
    })
  },
  // 搜索----按下回车键会搜多
  onSearch(e){
    let data = e.detail
    this.getSearch(data)
  },
  // 搜索接口
  async getSearch(params){
    let res = await app.request({url:app.base.onSearch,data:{data:params},method:'get'})
    let data = res.data.result
    wx.navigateTo({
      url:'../../pages/search/search',
      success:result =>{
        result.eventChannel.emit('searchInfo',data)
      },
      fail:() =>{console.log('错误')}
    })
  },
  // 获取商品信息
  getAllGoods(params){
    app.request({url:app.base.selectAllGoods,data:{id:params},method:'get'})
      .then(res =>{
        let data = res.data.result
        let arr = this.data.productInfo
        data.forEach(item => {
          let imgPath = JSON.parse(item.product_image)
          arr.push({
            id:item.product_id,
            title:item.product_title,
            desc:item.product_desc,
            price:item.product_price,
            image:imgPath[0],
            address:item.product_address,
            watch:item.msg_watch
          })
        });
        this.setData({
          productInfo:arr
        })
      })
  },
  // 获取到商品的id并跳转页面传递参数
  async chooseGoods(e){
    let data = e.currentTarget.dataset
    // 点击之后就浏览量加1
    let res = await app.request({url:app.base.getWatchNumber,data:{id:data.id},method:'get'})
    wx.navigateTo({
      url: '../../pages/detail/detail',
      success: (result) => {
        result.eventChannel.emit('getProductID',data)
      },
      fail: () => {console.log('错误');}
    });
  },
  go_update(){
    this.setData({
      productInfo:[]
    })
    this.getAllGoods(1)
  },
  // 获取分类商品信息接口
  async getCategoryInfo(params){
    let res =await app.request({url:app.base.getCategoryProductInfo,data:{id:params},method:'get'})
    let data = res.data.result
    return data
  },
  // 获取全部分类
  async getAllCategory(){
    let res = await app.request({url:app.base.getAllProduct,data:null,method:'get'})
    let data = res.data.data
    return data
  },

  // 分类跳转商品界面
  async gotoDaily(e){
    const categoryID = +e.currentTarget.dataset.id
    let data =await this.getCategoryInfo(categoryID)
    wx.navigateTo({
      url: '../../pages/category/category',
      success: (result) => {
        result.eventChannel.emit('getCategory',data)
      },
      fail: () => {console.log('错误');}
    })
  },
  async gotoaAllGoods(){
    let data = await this.getAllCategory()
    wx.navigateTo({
      url: '../../pages/category/category',
      success: (result) => {
        result.eventChannel.emit('getCategory',data)
      },
      fail: () => {console.log('错误');}
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllGoods(1)
  },
  showContent(e){
    if(e.detail.title === "收购商品"){
      this.setData({
        productInfo:[]
      })
      this.getAllGoods(2)
    }else{
      this.setData({
        productInfo:[]
      })
      this.getAllGoods(1)
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