// 个人中心
var express = require('express');
var router = express.Router();
// var mysqlOperation = require('../conf/mysqlOperation')//原来是直连的，长时间不用会断开
var mysqlPool = require('../conf/mysqlPool') //换成连接池
// 引入封装好的jsonwebtoken
var TOKEN = require('../conf/verifyToken') //换成连接池

// 下面跟权限有关的接口都要套上这个格式
//  var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
// ifok.then(data => {
// 有权限操作的代码
// }).catch(err => {
// 无权限操作的代码
// });

// 登录
router.post('/login', function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;
    var sql = `select * from users where account='${account}' and password='${password}'; `
    mysqlPool(sql)
        .then((data) => {
            if (data.length == 1) {
                var expTime = Math.floor(Date.now() / 1000) + 60 * 30;//过期时间1分钟
                var token = TOKEN.makeToken(account, password, expTime);//生成token
                // 将token存到数据库里
                var sqlsaveToken = `UPDATE users SET token="${token}"where account='${account}' and password='${password}';`
                mysqlPool(sqlsaveToken).then(data => { console.log("更新用户token") }).catch(err => { console.log("更新失败") });
                // 返回token给前端
                var message = {
                    token:token,
                    info: "登录成功~",
                    code: 1
                }
                res.send(message);
            } else {
                var message = {
                    info: "不存在用户~",
                    code: 0
                }
                res.send(message);
            }
        })
        .catch((err) => {
            var message = {
                info: "请求错误！",
                code: -1
            }
            res.send(message)
        })
});

//提交说说
router.post('/shuoshuo', function (req, res, next) {
    var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
    // 有权限则可以操作：
    ifok.then(data => {
        // 说说内容
        var content = req.body.content;
        // 图片链接
        var imgsUrl = req.body.imgsUrl;
        // 发表时间
        var nowTime = new Date();
        var createTime = nowTime.toLocaleString();
        var sql = `INSERT INTO myIndex ( content,url,createTime,account) VALUES ('${content}','${imgsUrl}','${createTime}','${req.headers.account}') `
        mysqlPool(sql)
            .then((data) => {
                var message = {
                    info: "发表成功~",
                    code: 1
                }
                res.send(message);
            })
            .catch((err) => {
                var message = {
                    info: "发表失败~",
                    code: 0
                }
                res.send(message)
            })
    }).catch(() => {
        var message = {
            info: "你没有权限操作o(´^｀)o~",
            code: -1
        }
        res.send(message)
    });
});

// 删除
router.post('/delete', function (req, res, next) {
    var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
    // 有权限则可以操作：
    ifok.then(data => {
        var tableName = req.body.tableName;
        var id = req.body.id;
        var sql = `DELETE FROM ${tableName} WHERE id=${id};`
        mysqlPool(sql)
            .then((data) => {
                var message = {
                    info: "删除成功~",
                    code: 1
                }
                res.send(message);
            })
            .catch((err) => {
                var message = {
                    info: "删除失败",
                    code: 0
                }
                res.send(message)
            })
    }).catch(() => {
        var message = {
            info: "你没有权限操作o(´^｀)o~",
            code: -1
        }
        res.send(message)
    });
});
// 编辑
router.post('/modify', function (req, res, next) {
    var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
    // 有权限则可以操作：
    ifok.then(data => {
        var tableName = req.body.tableName;
        var content = req.body.content;
        var id = req.body.id;
        var sql = `UPDATE ${tableName} SET content="${content}" where id=${id};`
        mysqlPool(sql)
            .then((data) => {
                var message = {
                    info: "修改成功~",
                    code: 1
                }
                res.send(message);
            })
            .catch((err) => {
                var message = {
                    info: "修改失败",
                    code: 0
                }
                res.send(message)
            })
    }).catch(() => {
        var message = {
            info: "你没有权限操作o(´^｀)o~",
            code: -1
        }
        res.send(message)
    });
});

// 回复留言
router.post('/updateReply', function (req, res, next) {
    var ifok = TOKEN.verifyMysqlToken(req.headers.token, req.headers.account);
    // 有权限则可以操作：
    ifok.then(data => {
        var returnContent = req.body.returnContent;
        var id = req.body.id;
        var nowTime = new Date();
        var createTime = nowTime.toLocaleString();
        var sql = `UPDATE message SET returnContent="${returnContent}",returnTime="${createTime}",account="${req.headers.account}" WHERE id=${id};`
        mysqlPool(sql)
            .then((data) => {
                var message = {
                    info: "回复成功~",
                    code: 1
                }
                res.send(message);
            })
            .catch((err) => {
                var message = {
                    info: "回复失败",
                    code: 0
                }
                res.send(message)
            })
    }).catch(()=> {
        var message = {
            info: "你没有权限操作o(´^｀)o~",
            code: -1
        }
        res.send(message)
    });
});



module.exports = router;