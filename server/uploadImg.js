// 引入图片所需模块
const multer = require('multer')
const fs = require('fs')
const path = require('path')


var storage = multer.diskStorage({
    destination: function(req,file,cb) {
      cb(null,"./upload/");
    },
    filename: function(req,file,cb) {
      cb(null,Date.now() + "-" + file.originalname);
    },
  });
  
  var createFolder = function(folder) {
    try {
      fs.accessSync(folder);
    } catch (e) {
      fs.mkdirSync(folder);
    }
  };
  
  var uploadFolder = "./upload/";
  createFolder(uploadFolder);
  var upload = multer({
    storage: storage,
  });

// 导出模块
module.exports = upload