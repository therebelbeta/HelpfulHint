#! /usr/bin/env node

// Copyright (c) 2015 Trent Oswald <trentoswald@therebelrobot.com

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
// IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
"use strict"

var vinyl = require('vinyl-fs')
var gulp = require('gulp')
var fs = require('fs')
var jshint = require('gulp-jshint')
var program = require('commander')
var debug = require('debug-log2')
var path = require('path')
var helpfulHint = require('./helpfulVinyl')
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
vinyl.src(path.resolve(process.cwd(), program.args[0]))
  .pipe(jshint())
  .pipe(helpfulHint())
  .on('end', function(err, chunk){
    debug('done', err, chunk)
    processComplete = true
  })


