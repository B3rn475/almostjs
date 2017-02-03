// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true*/
"use strict";

var core = require('almost-core'),
    extend = require('almost-extend');

core.Extender = extend.Extender;
core.createExtender = extend.createExtender;

module.exports = core;
