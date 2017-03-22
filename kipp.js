var express = require('express') //加载模块  
var app = express()//实例化之  
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var conf=require('./config.json');
var toTars=require('./lib/status.js');
var res_head={'Content-Type':'text/json','Encodeing':'utf8'};
var kipp_status={

	"online":"online",
	"ready":"ready",
	"running":"running",
	"error":"error",
	"offline":"offline"

}
var kipp_body={
    "name":"kipp001",
    "type":"rest",
    "status":kipp_status.online,
    "timestamp":"",
    "ip":conf.host.ip,
    "port":conf.host.port,
    "sid":""
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

/**
 *  say hello to tars
 */
function start(){

    logger.debug("send message to tars!");
    
    toTars.hello(kipp_body,function (err,body){

    	logger.info("receive message: ")
    	logger.info(body);
    	if(err) logger.error("kipp connect tars error!");

    	if(body.result=="success"){
    		kipp_body.timestamp=body.timestamp;
    		logger.info("kipp timestamp change "+kipp_body.timestamp);
    		toTars.add(kipp_body,function(err,body){

    			logger.info("add kipp to tars！")
    			if(body.result=="success"){

    				kipp_body.timestamp=body.timestamp;
    				kipp_body.status=kipp_status.online; 
    				logger.info("kipp ready to work! "+kipp_body.timestamp);
    			}else{
    				toTars.update(kipp_body,function(err,body){

    				logger.info("add kipp to tars！")
    				if(body.result=="success"){
    				kipp_body.timestamp=body.timestamp;
    				kipp_body.status=kipp_status.ready; 
    				logger.info("kipp ready to work! "+kipp_body.timestamp);
    		    	}
    				});
    	    	}
    	 
    		});
    	}
    });
}
start();


/**
 * Routes index
 */
 app.post('/task', function(req, res){ //Restful Post method  
    
    //update timestamp;
    logger.info("receive message:");
    logger.info(req.body);
    logger.info("begin working!");

    // toTars.update(kipp_body,function (err,body){

    // 	logger.info("receive message: ")
    // 	logger.info(body);
    // 	if(err) logger.error("kipp connect tars error!");
    // 	if(body.result=="success"){
    // 		kipp_body.timestamp=body.timestamp;
    // 		kipp_body.status=kipp_status.running; // success register tars;
    // 		logger.info("kipp timestamp change "+kipp_body.timestamp);
    // 	}
    	
    // });
    //处理任务
    	res.set(res_head);
    	res.send({result:"success","message":"done"}) //id 一般由数据库产生  

    
   
});

app.get('/isReady',function(req,res){

	logger.info("isReady")
	if(kipp_body.status==kipp_status.ready){

		return {"result":true}

	}else{
		return {"result":false}
	}

});
/**
 * Connect to the database.
 */

app.listen(conf.host.port); //监听8888端口，没办法，总不好抢了tomcat的8080吧！ 
