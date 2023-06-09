// pages/release/release.js
import Toast from '../../wxcomponents/vant/toast/toast';
let app =  getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:{
      sell_title:"填写商品信息"
    },
    formData:{
      goods_name:'',
      goods_price:'',
      goods_wxchat:'',
      goods_tele:'',
      goods_desc:'',
      goods_img:[],
      goods_address:'',
      user_id:'',
      category_id:0,
      msg_type:1
    },
    msg_type:[
      {
        text:'请选择发布类型',
        value:0
      },
      {
        text:'出售商品',
        value:1
      },
      {
        text:'收购商品',
        value:2
      }
    ],
    imgPath:[],
    show: false,
    fieldValue: '',
    cascaderValue: '',
    address:[{
      text:'西区',
      value:'1000',
      children:[]
    },{
      text:'东区',
      value:'1001',
      children:[]
    }],
    category: [{
      text:'请选择商品分类',
      value:0
    }],
    default: 0,
    fileList: [],
  },
  onClick() {
    this.setData({
      show: true,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  // 获取地址
  onFinish(e) {
    const { selectedOptions, value } = e.detail;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join(' ');
    // 将获取到的值加到formData的goods_address
    this.setData({
      fieldValue,
      cascaderValue: value,
      ['formData.goods_address']:fieldValue
    })
  },
  // 图片上传
  afterRead(e) {
    const { file } = e.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    app.uploadFile({url:app.base.uploadImg,filePath:file.url,name:'file',formData:{user:'test'}})
        .then(res=>{
          // 实现思路---res返回文件路径---保存文件路径并且赋值
          let result = JSON.parse(res.data)
          if(result.code === 200){
            let filename = result.data.path.slice(9)
            let imgUrl = app.base.host + "/" + filename 
            let imgPath = this.data.imgPath
            imgPath.push(imgUrl)
            let arr = this.data.fileList
            arr.push({url:imgUrl})
            this.setData({
              fileList:arr,
              ['formData.goods_img']:imgPath
            })
          }
        })
    
  },
  // 删除图片功能
  deleteImg(e){
    console.log(e);
    let idx = e.detail.index
    let arr = this.data.fileList
    arr.splice(idx,1)
    // 还需要把要传入数据库的图片地址给删除
    let imgArr = this.data.formData.goods_img
    imgArr.splice(idx,1)
    this.setData({
      fileList:arr,
      ['formData.goods_img']:imgArr
    })
  },
  // 监听用户输入,实现双向绑定
  getInput(e){
    // console.log(e)
    this.data.formData[`${e.currentTarget.dataset.params}`] = e.detail.value
    this.setData({
      formData:this.data.formData
    })
  },
    // 获取商品分类下拉菜单的内容
  getCategoryInfo(){
      app.request({url:app.base.categoryInfo,data:null,method:'get'})
          .then(res=>{
              let result = res.data.data
              let arr = this.data.category
              result.forEach((item,index) => {
              arr.push({
                  text:item.category_name,
                  value:item.category_id
              })
              })
              this.setData({
                  category:arr
              })
          })
  },
  // 获取商品分类子项，并赋值给formData
  getCategoryItem(e){
    let category = this.data.category
    this.data.formData.category_id = category[e.detail].value
    this.setData({
      formData:this.data.formData
    })
  },
  // 获取地址下拉菜单的内容
  getAddressInfo(){
    app.request({url:app.base.addressInfo,data:null,method:'get'})
        .then(res=>{
          let result = res.data.data
          // 存放西区宿舍数组
          let arrWest = []
          // 存放东区宿舍数组
          let arrEarth = []
          result.forEach((item)=>{
            if(item.address_title === '西区'){
              arrWest.push({
                text:item.address_item,
                value:(item.address_id + 100).toString()
              })
            }else{
              arrEarth.push({
                text:item.address_item,
                value:(item.address_id + 100).toString()
              })
            }
          })
          let menu1 = this.data.address[0].children
          let menu2 = this.data.address[0].children
          this.setData({
            'address[0].children':arrWest,
            'address[1].children':arrEarth,
          })
        })
  },
  // 发布出售商品信息
  sellReleaseBtn(){
    app.request({url:app.base.insertGoods,data:this.data.formData,method:'get'})
        .then(res=>{
          if(res.statusCode===200){
            Toast.success('发布成功');
            this.setData({
              formData:{},
              fileList:[],
              msg_type:this.data.msg_type,
              imgPath:[]
            })
          }else{
            Toast.fail('发布失败');
          }
          
        })
  },
  // 发布商品类型选择
  getGoodsType(e){
    let type = this.data.msg_type[e.detail].value
    this.setData({
      ['formData.msg_type']:type
    })
    console.log(this.data.formData);
  },
  // 生命周期函数--监听页面加载
  onLoad(){
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面一加载进来就获取存储到的用户信息
    this.getCategoryInfo()
    this.getAddressInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let user = wx.getStorageSync('user');
    if(user){
      let user_id = user.watermark.appid
      this.setData({
        ['formData.user_id']:user_id
      })
    }
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