var express = require('express');
const fs = require('fs')
var router = express.Router();
var fileOperation = require('../conf/fileOperation')

/* GET users listing. */
// 获得文章列表和时间
router.get('/articleList', function (req, res, next) {
  fileOperation.getFileChildrenName('./public/doc/')
    .then((data) => {
      var list = []
      data.forEach(function (item) {
        const stats = fs.statSync('./public/doc/' + item)// 获得文件最新修改时间,具体看nodejs里面的stat里面的属性介绍 
        var temp = item.split('.');
        item = temp[0];
        list.push([item, stats.mtime]);
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
  fileOperation.readDocument(`./public/doc/${title}.md`)
    .then((data) => {
      var result = {
        code: 1,
        content:JSON.stringify(data)
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
