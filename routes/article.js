var express = require('express');
const fs = require('fs')
var path = require('path');
var router = express.Router();
var fileOperation = require('../conf/fileOperation');
var mysqlPool = require('../conf/mysqlPool') //换成连接池


// 博客路径是js的相对的父级的父级
var articleRoad = path.resolve(__dirname, '../../Blogs')


// 将文档收入于mysql
function addArticleToMysql(fileroad, element, type) {
  var reg = RegExp(/.md/);
  //   //筛选符合条件的文件进行操作。对后缀为.md的操作
  if (reg.test(element)) {
    const stats = fs.statSync(`${fileroad}/${element}`)// 获得文件最新修改时间,具体看nodejs里面的stat里面的属性介绍 
    var title = element.split('.');
    element = title[0];
    var sql = `INSERT INTO article(articleName,createTime,knowledgeType) VALUES ('${element}','${stats.mtime}','${type}')`;
    // 把文章导入列表中
    mysqlPool(sql).catch((err) => {
      console.log(err)
    })
  }
}
// 获得博客类型的文章
function getFileList(fileroad, type) {
  fileOperation.getFileChildrenName(fileroad)
    .then((data) => {
      data.forEach(element => {
        addArticleToMysql(fileroad, element, type);
      })
    })

}

/* GET users listing. */
// 获得文章列表和时间
router.get('/articleList', function (req, res, next) {
  var type = req.query.type;
  // // 这是把文章列表导入mysql表格里的方法-----------
  // fileOperation.getFileChildrenName(articleRoad)
  //   .then((data) => {
  // var ignore = RegExp(/.git/);
  // data.forEach(element => {
  //   //对.git文件不做操作；
  //   if (!ignore.test(element)) {
  //     // 博客类别路径
  //     var fileroad = path.join(articleRoad, element);
  //     getFileList(fileroad, element)
  //   }
  // })
  // })


  // 这是获取文章列表信息的方法--------------------
  var sql = `SELECT * FROM article WHERE knowledgeType='${type}';`;
  // 把文章导入列表中
  mysqlPool(sql)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err)
    })
});


// 获得文章内容
router.post('/articleContent', function (req, res, next) {
  var title = req.body.title;
  var type = req.body.type;
  fileOperation.readDocument(`${articleRoad}/${type}/${title}.md`)
    .then((data) => {
      var result = {
        code: 1,
        content: JSON.stringify(data)
      }
      res.send(result)
    }
    )
    .catch((err) => {
      var result = {
        code: 0,
        content: "请求失败"
      }
      res.send(result)
    })
});

module.exports = router;
