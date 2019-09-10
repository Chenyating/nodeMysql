var express = require('express');
const fs = require('fs')
var path = require('path');
var router = express.Router();
var fileOperation = require('../conf/fileOperation')


// 博客路径是js的相对的父级的父级
var articleRoad = path.resolve(__dirname, '../../Blogs')

/* GET users listing. */
// 获得文章列表和时间
router.get('/articleList', function (req, res, next) {
  fileOperation.getFileChildrenName(articleRoad)
    .then((data) => {
      var list = []
      data.forEach(function (item) {
        var reg = RegExp(/.md/);
        //筛选符合条件的文件进行操作。对后缀为.md的操作
        if (reg.test(item)) {
          console.log(articleRoad+item)
          const stats = fs.statSync(`${articleRoad}/${item}`)// 获得文件最新修改时间,具体看nodejs里面的stat里面的属性介绍 
          var temp = item.split('.');
          item = temp[0];
          list.push([item, stats.mtime]);
        }
      })
      res.send(list);
    }
    )
    .catch((err) => {
      res.send("请求错误")

    })
});


// 获得文章内容
router.post('/articleContent', function (req, res, next) {
  var title = req.body.title;
  fileOperation.readDocument(`${articleRoad}/${title}.md`)
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
        content: "#请求失败"
      }
      res.send(result)
    })
});

module.exports = router;
