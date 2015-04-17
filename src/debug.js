// Copyright (c) 2015 Trent Oswald <trentoswald@therebelrobot.com

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
// IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
'use strict'

var stackTrace = require('stack-trace')
var colors = require('colors')
var path = require('path')

module.exports = function debugRun () {
  if (process.env.DEBUG) {
    var args, file, frame, line, method
    args = 1 <= arguments.length ? [].slice.call(arguments, 0) : []

    frame = stackTrace.get()[1]
    file = path.basename(frame.getFileName())
    line = frame.getLineNumber()
    method = frame.getFunctionName()

    args.unshift('' + file + ':' + line + ' in ' + method + '()')
    args[0] = args[0].grey
    return console.log.apply(console, args) // changed 'debug' to canonical npmlog 'info'
  }
  return false
}
