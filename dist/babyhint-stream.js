var es = require('event-stream');

module.exports = function(opts) {

  function modifyFile(file, cb) {
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error('babyhint-vinyl: Streaming not supported'));
    console.log(file.toString())
    cb(null, file)
  }

  return es.map(modifyFile);
};
