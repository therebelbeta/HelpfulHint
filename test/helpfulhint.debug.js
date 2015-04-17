
var fs = require('fs')
var BabyHint = require('../src/helpfulhint')
var debug = require('../src/debug')
var fixtures = {}
var async = require('async')
var jshint = require('jshint').JSHINT
var jshintcli = require('jshint/src/cli');

debug(jshint)

fs.readdir(__dirname+'/fixtures', function _afterFixturesReaddir (err, files) {
  if (err) throw new Error(err)
  console.log(files)
  debug(files)
  files = files.map(function(filename){
    return function _readFile(callback){
        fs.readFile(__dirname+'/fixtures/'+filename, function _afterFileRead(err, file){
          if (err) return callback(true, err)
          fixtures[filename] = file.toString()
          newresults = jshintcli.extract(fixtures[filename], 'auto')
          newnewresults = jshint(newresults)
          newnewnewresults = jshint.errors.map(function (err) {
            if (!err) return;
            return { file: __dirname+'/fixtures/'+filename, error: err };
          }).filter(Boolean);
          debug('NEWnewnewRESULTS', newnewnewresults)
          callback(null)
        })
    }
  })
  async.parallel(files, function _afterAllFileReads(err, results){
    debug(fixtures)
    BabyHint.babyErrors
  })
    // fixtures = files
})
