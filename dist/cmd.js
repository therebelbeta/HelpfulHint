#! /usr/bin/env node

/**
 * Module dependencies.
 */

var jshint = require('jshint');
var _ = require('lodash');
var minimist = require('minimist');
var colors = require('colors');
var Bluebird = require('bluebird');
var glob = require('glob');
glob = Bluebird.promisifyAll(glob);
var path = require('path');
var fs = require('fs');
var through = require('through2');
var split = require('split');

require('./globals');
var BabyHint = require('./babyhint');

// Optional Internals
var verbose = function () {};
var debug = function () {};
var thisFile;

// Internals
var args = minimist(process.argv.splice(2));
var bhConfig;
var globPath = '';
var globFile = '**/*.js';
var globIgnore = globPath + 'node_modules/**/*.js';

if (args.debug) {
  setDebug();
}

if (args.verbose) {
  setVerbose();
}

debug(thisFile + ':' + __line, __function, '| Arguments:', args)

if (args.help || args.h) {
  printHelpDialog();
}
if (args.version || args.v) {
  printVersion();
}
if (args.config || args.c) {
  var config = args.config || args.c;
  setConfig(config)
}
if (args.filename || args.f) {
  var file = args.filename || args.f;
  setFile(file)
}

if (args.ignore || args.i) {
  var ignore = args.ignore || args.i;
  setIgnore(ignore)
}

if (args.reporter || args.r) {
  var reporter = args.reporter || args.r;
  setReporter(reporter)
}



runGlobSearch();

function printHelpDialog() {
  debug(thisFile + ':' + __line, __function, '| Printing help dialog')
  console.log('Usage'.bold + ':');
  console.log('  babyhint [options]');
  console.log('');
  console.log('Options'.bold + ':');
  console.log('  -c, --config STRING      Custom configuration file');
  console.log('  -f, --filename STRING    Pass in a filename (node-glob pattern)');
  console.log('  -i, --ignore STRING      Pass in an ignore pattern (node-glob pattern)');
  console.log('  -r, --reporter STRING    Custom reporter (<path>|jslint|checkstyle|unix)');
  console.log('      --verbose            Show additional details');
  console.log('      --debug              Show debug statements');
  console.log('  -v, --version            Display the current version');
  console.log('  -h, --help               Display this help information');
  process.exit(0)
};

function setConfig(config) {
  debug(thisFile + ':' + __line, __function, '| Setting config:', config)
  bhConfig = config;
}

function setFile(file) {
  debug(thisFile + ':' + __line, __function, '| Setting file:', file)
  globFile = file;
  if (file.indexOf('.js') > -1) {
    file = file.split('/');
    file.pop();
    console.log(file);
    if (file[file.length - 1] === '**') {
      file.pop();
      file = file.join('/');
      globPath = file + '/';
      globIgnore = globPath + "node_modules/**/*.js"
      return
    }
    globIgnore = false;
    return
  }
  globPath = globFile + '/';
  globIgnore = globPath + "node_modules/**/*.js"
  globFile = globFile.split('/');
  if (globFile[globFile.length - 1] === '') {
    globfile.pop();
  }
  globFile = globFile.join('/') + '**/*.js'
}

function setIgnore(ignorePath) {
  debug(thisFile + ':' + __line, __function, '| Setting ignore:', ignorePath)
  globIgnore = globPath + ignorePath;
}

function setReporter(reporter) {
  debug(thisFile + ':' + __line, __function, '| Setting reporter:', reporter)
}

function setVerbose() {
  debug(thisFile + ':' + __line, __function, '| Setting verbose')
  verbose = console.log;
}

function setDebug() {
  thisFile = __filename.split('/');
  thisFile = thisFile[thisFile.length - 1];
  console.log((thisFile + ':' + __line).grey, __function.grey, '| Setting Debug'.grey)
  debug = function () {
    var debugStatements = [].slice.call(arguments, 0);
    debugStatements = debugStatements.map(function (statement) {
      if (typeof statement === 'string') {
        return statement.grey
      }
      return statement
    })
    console.log.apply(console, debugStatements)
  }
}

function runGlobSearch() {
  debug(thisFile + ':' + __line, __function, '| Running Glob Search');
  var options = {
    ignore: globIgnore
  }
  debug(thisFile + ':' + __line, __function, '| Glob Options:', options, '\n  Glob Path:', globFile);
  glob.globAsync(globFile, options).then(_runBabyHint).catch(function (error) {
    throw new Error(error);
    process.exit(1);
  })
}

function printVersion() {
  debug(thisFile + ':' + __line, __function, '| Printing version')
  console.log('babyhint v0.0.1')
  process.exit(0)
}

function _runBabyHint(files) {
  debug(thisFile + ':' + __line, __function, '| Running BabyHint', files)

  files = _.map(files, function buildPromise(filePath) {
    return new Promise(function fileStreamPromise(resolve, reject) {
      var fullPath = fs.realpathSync(filePath);
      var filename = fullPath.split('/');
      filename = filename[filename.length-1];
      debug(thisFile + ':' + __line, __function, '|', (filename+':').bold);
      var stream = fs.createReadStream(filePath);
      stream.pipe(split()).pipe(through(function checkString(line, enc, next) {
          debug(line.toString());
          // check line here
          next();
        }))
        .on('end', function () {
          resolve()
        });
    });
  })
  Promise.all(files).then(function (results) {
    debug('RESULTS', results)
    process.exit(0);
  });
}
