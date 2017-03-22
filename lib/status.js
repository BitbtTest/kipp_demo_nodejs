var conf=require('../config.json');
var request = require('request-json');


/**
 *  log configure
 **/
var logger = require('./log.js').logger();
var url='http://'+conf.tars.ip+':'+conf.tars.port+'/';
var client = request.createClient(url);

/**
 * kipp 调度方法，暴露给tars
 * @param senddata 
 * @returns {}
 */

module.exports.hello= function dis(data,fn) {
 
	client.post('hello', data, function(err, res, body) {
    	// logger.debug(res);
    	logger.debug(body);
		fn(err,body);
    });

}

module.exports.add= function dis(data,fn) {

	client.post('kippstatus/', data, function(err, res, body) {
    	// logger.debug(res);
    	logger.debug(body);
		fn(err,body);
    });
}
/**
 * kipp 调度方法，暴露给tars
 * @param senddata 
 * @returns {}
 */
module.exports.update= function dis(data,fn) {

	client.put('kippstatus/'+data.name, data, function(err, res, body) {
    	// logger.debug(res);
    	logger.debug(body);
		fn(err,body);
    });
}

function hello(data){

	
	
}