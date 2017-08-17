/**
 * Created by linhong.li on 2017/8/10.
 */
 var express = require('express');
var config = require('./config/index');

var port = process.env.port || config.build.port;
var app = express();
console.log (port);
var router = express.Router();

router.get('/',function (req,res,next) {
  req.url = '/index.html';
  next();
});

app.use(router);

router.get('/seller',function (req,res) {
  res.json({
    error: 0,
    data:seller
  })
});

//定义异步接口
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

router.get('/seller',function (req,res) {
  res.json({
    error: 0,
    data:seller
  })
});

router.get('/goods',function (req,res) {
  res.json({
    error: 0,
    data:goods
  })
});

router.get('/ratings',function (req,res) {
  res.json({
    error: 0,
    data:ratings
  })
});

var opn = require('opn');
var uri = 'http://localhost:' + port;
console.log('> Starting dev server...');
opn(uri);

app.use('/api',router);
app.use(express.static('./dist')); // 提供静态资源
app.listen(port);


