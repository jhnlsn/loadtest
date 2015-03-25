var winston = require('winston')
  , CONF    = require('config');

var LogstashUDP = require('winston-logstash-udp').LogstashUDP;

var transports = [];

if(CONF.logger.console.enabled) {
  transports.push(new (winston.transports.Console)({'timestamp':false, 'level': CONF.logger.console.level}));
}
if(CONF.logger.udp.enabled) {
  transports.push(new (LogstashUDP)({'port':CONF.logger.udp.port, 'appName': CONF.logger.udp.app_name, 'host': CONF.logger.udp.host}));
}

var logger = new (winston.Logger)({
  transports: transports
});

var wrapper = function wrapper(test_id, worker_id) {
  this.run_id = test_id;
  this.worker_id = worker_id;
};

wrapper.prototype.log = function(level, args) {

  if(typeof args[args.length-1] !== 'object') {
    Array.prototype.push.call(args, {});
  }

  if(this.run_id) {
    args[args.length-1].run_id = this.run_id;
  }
  if(this.worker_id) {
    args[args.length-1].worker_id = this.worker_id;
  }

  var _args = Array.prototype.slice.call(args);

  logger[level].apply(this, _args);
};

wrapper.prototype.info = function() {
  this.log('info', arguments);
};

wrapper.prototype.debug = function() {
  this.log('debug', arguments);
};

wrapper.prototype.error = function error() {
  this.log('error', arguments);
};

module.exports = wrapper;