var mysql = require('mysql');
var db = require('./db');
// 1、创建连接
var connection = mysql.createConnection(db);

// 本js是对数据库的操作
// 2、连接数据库
connection.connect(function (err) {
    if (err) {
        console.error('连接失败' + err);
        return;
    }
});

// 3、对数据表操作
// 查询分页表的所有数据,按最新数据来查询
function getList(tableName,num,page) {
    return new Promise((resolve, reject) => {
        // 按照倒序来分页取值
        connection.query(`select * from ${tableName}  order by id desc limit ${num*page},${num} ;`, function (err, results, fields) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
}

// 条件查询表的所有数据
function getListCondition(tableName,type,num,page) {
    return new Promise((resolve, reject) => {
        // 按照倒序来分页取值
        connection.query(`select * from ${tableName} where type=${type} limit ${num*page},${num} ;`, function (err, results, fields) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
}

// 插入留言的的信息
function insertList(name,message,headId,createTime) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO message (name, content,headImg,createTime) VALUES ('${name}', '${message}','${headId}','${createTime}') ; `, function (err, results, fields) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
}

// 对次数的操作
// 增加次数
function addTimes(name) {
    return new Promise((resolve, reject) => {
        connection.query(`update times set times = times + 1 where name='${name}'; `, function (err, results, fields) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
}

// 获得次数
function getTimes(name) {
    return new Promise((resolve, reject) => {
        connection.query(`select times from times where name='${name}';`, function (err, results, fields) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
}

// 4、关闭连接
// connection.end();
module.exports = {
    getList,
    getListCondition,
    insertList,

    addTimes,
    getTimes
};