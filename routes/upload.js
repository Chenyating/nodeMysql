// 本js是上传的接口
var express = require('express');
var router = express.Router();
// 引入封装好的jsonwebtoken
var TOKEN = require('../conf/verifyToken') //换成连接池

// 下面跟权限有关的接口都要套上这个格式
//  var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.username);
// ifok.then(data => {
// 有权限操作的代码
// }).catch(err => {
// 无权限操作的代码
// });

// 1、引入文件操作
var fs = require('fs')
// 2、引入上传插件
var multer = require('multer')
// 3、上传文件放置的位置
var imgRoad = '../resource/img/'
var upload = multer({ dest: imgRoad })
// 
router.post('/img', upload.single('file'), function (req, res, next) {
    var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
    ifok.then(data => {
        // 修改文件名，默认文件名变成2进制了。
        var time = new Date().getTime();
        var fileType = req.file.mimetype.split("/");
        if (fileType[1] == "jpeg") {
            var imgtype = "jpg";
        } else {
            var imgtype = fileType[1];
        }
        fs.renameSync(imgRoad + req.file.filename, imgRoad + time + '.' + imgtype);
        // 返回我的图片地址
        // 我放在服务器上面的图片存的路径是http://www.yating.online/res/img。前面代理到res了
        var message = {
            imgUrl: `https://www.yating.online/res/img/${time}.${imgtype}`,
            info: "发布成功~",
            code: 1
        }
        res.send(message);
    }).catch(err => {
        var message = {
            info: "你没有权限哦~￣へ￣",
            code: -1
        }
        res.send(message)
    });
})
module.exports = router;
