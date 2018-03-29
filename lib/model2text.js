// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var core = require('almost-core');

module.exports = core.merge(
    core.merge(
        core.none('rules should just generate name, isFolder, content and children'),
        {
            name: core.single('rules shouldn\'t change name to elements'),
            isFolder: core.single('rules shouldn\'t change type of elements'),
            content: core.single('rules shouldn\'t change file content'),
            children: core.lazy(core.flatten())
        }
    )
);
