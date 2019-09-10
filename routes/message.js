var express = require('express');
var router = express.Router();
// var mysqlOperation = require('../conf/mysqlOperation')//原来是直连的，长时间不用会断开
var mysqlPool = require('../conf/mysqlPool') //换成连接池

// 留言只有两个功能：提交留言，和获得留言列表

// 获得留言列表
router.get('/messageList', function (req, res, next) {
    var tableName = 'message'
    var num = req.query.num;
    var page = req.query.page;
    var sql = `select * from ${tableName} order by id desc limit ${num * page},${num}`
    mysqlPool(sql)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send("请求错误");
        })
});

// 提交留言信息
router.post('/takeMessage', function (req, res, next) {
    var name = req.body.name;
    var message = req.body.content;
    var headId = Math.ceil(Math.random() * 3); //随机生成随机头像序号
    var nowTime = new Date();
    var createTime = nowTime.toLocaleString();
    var sql = `INSERT INTO message (name, content,headImg,createTime) VALUES ('${name}', '${message}','${headId}','${createTime}') `
    mysqlPool(sql)
        .then((data) => {
            var message = {
                info: "感谢你的留言~",
                code: 1
            }
            res.send(message);
        })
        .catch((err) => {
            var message = {
                info: "能不能取一个与众不同的名字撒？~",
                code: 0
            }
            if (err.sqlState == 23000) {
                res.send(message)
            }
            res.send(message)
        })
});

module.exports = router;