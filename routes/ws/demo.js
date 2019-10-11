var WebSocket = require('ws');
function wbs(){
    var wss = new WebSocket.Server({ port: 8080 });
    wss.on('connection', function connection(ws) {
      var msg;
      console.log('连接成功.');
      ws.on('message', function incoming(message) {
        console.log('我收到的信息是：', message);
        msg=message;
        ws.send(`好的我收到了！${msg}`);
      });
    });
}

module.exports=wbs;