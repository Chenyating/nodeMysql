var express = require('express');
var router = express.Router();
// var mysqlOperation = require('../conf/mysqlOperation')//原来是直连的，长时间不用会断开
var mysqlPool = require('../conf/mysqlPool')//换成连接池

// 统计次数

// 增加对应的次数
router.get('/addTimes', function (req, res, next) {
    var name = req.query.name;
    var sql=`update times set times = times + 1 where name='${name}'`
    mysqlPool(sql)
        .then((data) => {
            res.send("增加成功");
        })
        .catch((err) => {
            res.send("请求错误");
        })
});

// 获得对应的次数
router.get('/getTimes', function (req, res, next) {
    var name = req.query.name;
    var sql=`select times from times where name='${name}'`
    mysqlPool(sql)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send("请求错误");
        })
});


module.exports = router;
