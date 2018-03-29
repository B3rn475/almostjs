// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true*/
"use strict";

var Exception = require('almost-core').Exception;

function Rule(condition, body) {
    if (!(this instanceof Rule)) { return new Rule(condition, body); }

    if (condition === undefined) { throw new Exception('missing condition function'); }
    if (typeof condition !== 'function') { throw new Exception('invalid condition function'); }
    if (body === undefined) { throw new Exception('missing body function'); }
    if (typeof body !== 'function') { throw new Exception('invalid body function'); }

    this.check = condition;
    this.execute = body;
}

// Helpers
Rule.always = function () { return true; };
Rule.never = function () { return false; };

module.exports = Rule;
