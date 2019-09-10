var mysql = require('mysql');
var db = require('./db');
// 使用连接池，提升性能

module.exports= function (sql) {
    return new Promise((resolve, reject) => {
        // 一、新建一个连接池
        var pool = mysql.createPool(db);
        // 二、脸上连接池
        pool.getConnection(function (err, connection) {
            // 三、使用sql语句操作
            connection.query(sql, function (err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
                // 四、释放连接池
                connection.release();
            });
        })
    })
}


// 下面是原来的方法，不要了，太累赘了。封装成一个新的方法；
// var pool = mysql.createPool(db);
// module.exports={
// // // 对数据表操作
// // // 查询分页表的所有数据,按最新数据来查询
// // getList(tableName, num, page) {
// //     return new Promise((resolve, reject) => {
// //         pool.getConnection(function (err, connection) {
// //             // 按照倒序来分页取值
// //             connection.query(`select * from ${tableName}  order by id desc limit ${num * page},${num}`, function (err, results, fields) {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(results);
// //                 }
// //                 connection.release();
// //             });
// //         })
// //     })
// // },

// // // 条件查询表的所有数据
// // getListCondition(tableName, type, num, page) {
// //     return new Promise((resolve, reject) => {
// //         pool.getConnection(function (err, connection) {
// //             // 按照倒序来分页取值
// //             connection.query(`select * from ${tableName} where type=${type} limit ${num * page},${num}`, function (err, results, fields) {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(results);
// //                 }
// //                 connection.release();
// //             });
// //         })
// //     })
// // },

// // // 插入留言的的信息
// // insertList(name, message, headId, createTime) {
// //     return new Promise((resolve, reject) => {
// //         pool.getConnection(function (err, connection) {
// //             connection.query(`INSERT INTO message (name, content,headImg,createTime) VALUES ('${name}', '${message}','${headId}','${createTime}') `, function (err, results, fields) {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(results);
// //                 }
// //                 connection.release();
// //             });
// //         })
// //     })
// // },

// // // 对次数的操作
// // // 增加次数
// // addTimes(name) {
// //     return new Promise((resolve, reject) => {
// //         pool.getConnection(function (err, connection) {
// //             connection.query(`update times set times = times + 1 where name='${name}'; `, function (err, results, fields) {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(results);
// //                 }
// //                 connection.release();
// //             });
// //         })
// //     })
// // },

// // // 获得次数
// // getTimes(name) {
// //     return new Promise((resolve, reject) => {
// //         pool.getConnection(function (err, connection) {
// //             connection.query(`select times from times where name='${name}';`, function (err, results, fields) {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(results);
// //                 }
// //                 connection.release();
// //             });
// //         })
// //     })
// // }
// }