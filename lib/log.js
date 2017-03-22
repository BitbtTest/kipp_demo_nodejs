var log4js=require('log4js');
log4js.configure('./lib/log4js.json');
var logger = log4js.getLogger('normal');
// logger.setLevel('INFO');
logger.setLevel('DEBUG');

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *			  如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger = function(name) {
		return logger;
}