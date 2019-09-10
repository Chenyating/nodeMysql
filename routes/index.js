var express = require('express');
var router = express.Router();
// var mysqlOperation = require('../conf/mysqlOperation')//原来是直连的，长时间不用会断开
var mysqlPool = require('../conf/mysqlPool') //换成连接池

/* GET home page. */
// 获得留言列表
// router.get('/', function (req, res, next) {
// var num=req.query.num;
// var page=req.query.page;
// mysqlPool.getList('myIndex',num,page)
// .then((data) => {
// res.send(data);
// })
// .catch((err) => {
// res.send("请求错误");
// })
// });

router.get('/', function (req, res, next) {
    var tableName = 'myIndex'
    var num = req.query.num;
    var page = req.query.page;
    // SELECT content,`user`,createTime,url,img as headImg FROM myIndex JOIN users on myIndex.userId=users.id ORDER BY myIndex.id DESC LIMIT 1 ,5;
    var sql = `SELECT content,user,createTime,url,img as headImg FROM ${tableName} JOIN users on ${tableName}.userId=users.id ORDER BY ${tableName}.id DESC LIMIT ${num * page},${num}`
    mysqlPool(sql)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send("请求错误");
        })
});
module.exports = router;