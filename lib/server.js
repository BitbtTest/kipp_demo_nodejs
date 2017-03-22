var express = require('express') //加载模块  
var app = express()//实例化之  
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var conf=require('./config.json');
var toTars=require('./lib/status.js');

var kipp_body={
    "name":"kipp001",
    "type":"Interface",
    "status":"ready",
    "timestamp":"",
    "ip":conf.host.ip,
    "prot":conf.host.port
};


/**
 *  log configure
 **/
var logger = require('./lib/log.js').logger();

/**
 * Configuration
 */
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });

/**
 *  say hello to tars
 */
function start(){
    logger.debug("send message to tars!");
    toTars.hello(kipp_body);

}
start();


/**
 * Routes index
 */
 app.post('/work/', function(req, res){ //Restful Post method  
    //update timestamp;
    var date=new Date();
    req.body.timestamp=date.getTime();
    //name mast different！
    kipps().findOne({"name":req.body.name},function (err, doc) {
    if (err) return next(err);
    if (doc) return res.send({result:'false',describe:'Your name is already in TARS. Please change name and try again'});
     	var kipp = kipps(req.body);
    	kipp.save(function (err) {
    	if (err) return next(err);
    // res.redirect('/login/' + user.email);
    	res.set(res_head);
    	res.send({result:"success",id:kipp._id,name:req.body.name,status:req.body.status,timestamp: req.body.timestamp}) //id 一般由数据库产生  
    	});
    }); 
   
    console.log("add new devices:"+req.body.name+"Type is:"+req.body.type);
})

/**
 * Connect to the database.
 */

app.listen(conf.host.port); //监听8888端口，没办法，总不好抢了tomcat的8080吧！ 
