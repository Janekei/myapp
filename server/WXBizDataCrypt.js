var crypto = require('crypto')

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  var sessionKey = new Buffer(this.sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
     // 根据给定的算法，密钥和初始化向量，创建并返回一个Decipher解密对象。
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    //往decipher实例中添加数据，第一个参数是数据，第二个参数是传入数据的格式，默认是 ‘binary’。第三个参数是返回的数据格式。
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    //返回任何剩余的解密内容。不能调用多次
    decoded += decipher.final('utf8')
    
    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error(err)
  }

  // if (decoded.watermark.appid !== this.appId) {
  //   console.log(decoded.watermark.appid,this.appId);
  //   throw new Error('Illegal Buffer111')
  // }

  return decoded
}

module.exports = WXBizDataCrypt
