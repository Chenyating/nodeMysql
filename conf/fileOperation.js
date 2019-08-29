var fs = require('fs');

// 本js是对文件的操作


// 查询某个目录下的子文件名
// road 路径名称
function getFileChildrenName(road) {
    return new Promise((resolve, reject) => {
        fs.readdir(road,(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data)
            }
        });
    })
}

// 获得文件内容
// fileRoad 文件的路径
function readDocument(road) {
    return new Promise((resolve, reject) => {
        fs.readFile(road,'utf8',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data)
            }
        });
    })
}

module.exports={
    getFileChildrenName,readDocument
}