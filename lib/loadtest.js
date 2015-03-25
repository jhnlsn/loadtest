var program = require('commander')
  , cluster = require('cluster')
  , shortid = require('shortid')
  , Logger = require('logger');

var workers = require('os').cpus().length;

/**
 * Differentiate between test runs
 * @type {number}
 */
var test_id = 0;

var intVal = function(val) {
  return parseInt(val);
};

program
  .version(package.version)
  .option('-r, --runner <file>', 'Name of test runner to execute')
  .option('-w, --workers <n>', 'Total number of workers, defaults to number of cpus', intVal, workers)
  .option('-b, --batches <n>', 'Total number of batches per worker, defaults to 1', intVal, 1)
  .option('-c, --concurrent <n>', 'Concurrent starts per batch, defaults to 1', intVal, 1)
  .option('-d, --delay <n>', 'Delay between batches in ms, defaults to 0', intVal, 0)
  .option('-i, --instance <n>', 'Which instance this is, useful for running on many servers at once, defaults to 0', intVal, 0)
  .parse(process.argv);

if(program.runner) {
  var runner = require('./runners/' + program.runner + '.js');
} else {
  throw new Error('test case not specified');
}

if(runner) {

  if(cluster.isMaster) {
    test_id = shortid.generate();

    var master_log = new Logger(test_id, 0);

    var start_info = {
      test_file: program.runner,
      workers: program.workers,
      batches: program.batches,
      delay: program.delay,
      concurrency: program.concurrent
    };

    master_log.info('starting test', start_info);
  }
}