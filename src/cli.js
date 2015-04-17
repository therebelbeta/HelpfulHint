#! /usr/bin/env node

var vinyl = require('vinyl-fs')
var gulp = require('gulp')
var jshint = require('gulp-jshint')
var program = require('commander')
var debug = require('debug-log2')
var path = require('path')
var through = require('through2')
var processComplete = false

function _retrieveLib (libname) {
  debug('Custom Library', libname)
  return libname
}
function _retrieveConfig (configpath) {
  configpath = path.relative(__dirname, path.resolve(process.cwd(), configpath))
  debug('Custom Config', process.cwd(), configpath)
  try{
    var config = require(configpath)
    config.lookup = false
    return config
  }
  catch (error) {
    throw error
  }
}
function _setDebug (debug) {
  process.env.DEBUG = debug;
  return debug;
}
function _setVerbose (verbose) {
  process.env.VERBOSE = verbose;
  return verbose;
}

program._name = 'helpfulhint'

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-l, --library <libname>', 'Set a custom library plugin', _retrieveLib)
  .option('-c, --config <configpath>', 'Set a custom .helpfulhintrc file', _retrieveConfig)
  .option('-#, --debug', 'Turn on debug feedback', _setDebug)
  .option('-v, --verbose', 'Turn on verbose feedback', _setVerbose)
  .parse(process.argv);

debug(' library:', program.library)
debug(' config:', program.config)
debug(' debug:', program.debug)
debug(' version:', program.v)
debug(' verbosity:', program.verbose);
debug(' args:', program.args);

if(program.args.length < 1){
  throw new Error('No entry file specified.')
}
filepath = path.relative(__dirname, path.resolve(process.cwd(), program.args[0]))
if(program.config){

}
debug('filepath',filepath)
gulp.src('../test/fixtures/sample.js')
  .pipe(_helpfulHint())
  .pipe(jshint())
  .pipe(_helpfulHint())
  .on('end', function(){
    debug('done')
    processComplete = true
  })

function _helpfulHint(opts){
  debug('helpfulhint')
  return through.obj(_hhBuffer, _hhEnd)
}
function _hhBuffer(chunk, enc, cb){
  debug(chunk, enc, cb)
  if (chunk.isNull()) {
    this.push(chunk);
    return cb(null, chunk);
  }

  if (chunk.isStream()) {
    this.emit("error", "cannot accept streams");
    return cb(null, chunk);
  }
  if (chunk.isBuffer()) {
    chunk.contents = new Buffer(String(chunk.contents) + "\n test");
    this.push(chunk);
  }
  return cb(null, chunk);
}
function _hhEnd(cb){
  return cb()
}

// function _wait () { // Prevent node from exiting before vinyl-fs is complete.
//   if (!processComplete) {
//     debug('waiting')
//     setTimeout(_wait, 1000);
//     return
//   }
//   debug('done!!!')
// };
// _wait();
