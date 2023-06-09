// 封装request方法
const request = async (params)=>{
  let url = params.url
  let data = params.data
  let method = params.method
  let header = {
    "Content-Type":"application/json"
  }
  // 返回一个promise对象
  return new Promise((resolve,reject)=>{
    wx.request({
      url, 
      data,
      method,
      header,
      success:res=>{
        // console.log('util-------',res)
        if(res.statusCode === 200){
          resolve(res)
        }else{
          reject('网络连接异常！')
        }
      },
      error:e =>{
        reject(e)
      }
    })
  })
}

const uploadFile = async (params)=>{
  let {url,filePath,name,formData} = params
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url, 
      filePath,
      name,
      formData,
      success:res=>{
        resolve(res)
      },
      error:e =>{
        reject(e)
      }
    })
  })
}

module.exports = {
  request,
  uploadFile
}

