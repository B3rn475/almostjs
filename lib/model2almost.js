// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var core = require('almost-core');

module.exports = core.merge(
    core.none('rules should just generate elements, relations and metadata'),
    {
        elements: core.flatten(core.reduceBy(
            'id',
            core.merge(
                core.none('elements should just have the id, type, attributes and metadata fields'),
                {
                    id: core.first(),
                    type: core.single('element type field should be generated once'),
                    attributes: core.merge(core.mergeOrSingle(), {}),
                    metadata: core.lazy(core.merge(core.mergeOrSingle(), {}))
                }
            )
        )),
        relations: core.flatten(),
        metadata: core.lazy(core.merge(core.mergeOrSingle(), {}))
    }
);
