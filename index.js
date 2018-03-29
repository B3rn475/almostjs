// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    core = require('almost-core'),
    extend = require('almost-extend'),
    Exception = core.Exception,
    m2m = require('./lib/model2model'),
    m2a = require('./lib/model2almost'),
    m2t = require('./lib/model2text'),
    Rule = require('./lib/rule'),
    createRule = require('./lib/rule'),
    createTransformer = require('./lib/transformer');

module.exports = {
    core: core,
    extend: extend,
    Exception: Exception,
    Rule: Rule,
    createRule: createRule,
    createExtender: extend.createExtender,
    createTransformer: createTransformer,
    m2a: m2a,
    m2m: m2m,
    m2t: m2t
};
