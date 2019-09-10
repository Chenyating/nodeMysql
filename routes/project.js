var express = require('express');
var router = express.Router();
// var mysqlOperation = require('../conf/mysqlOperation')//原来是直连的，长时间不用会断开
var mysqlPool = require('../conf/mysqlPool')//换成连接池

// 根据类型查询项目：0为自己，1为h5，,2为官网，3为小程序
router.post('/getProjectByType', function (req, res, next) {
    var tableName=req.body.tableName;
    var type=req.body.type;
    var num=req.body.num;
    var page=req.body.page;
    var sql=`select * from ${tableName} where type=${type} order by id desc limit ${num * page},${num}  `
    mysqlPool(sql)
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        console.log(err,"??")
        res.send("请求错误")
    })
});

module.exports = router;
