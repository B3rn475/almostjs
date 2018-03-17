// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    core = require('almost-core'),
    Exception = core.Exception,
    Rule = require('./lib/rule'),
    extend = require('almost-extend');

var m2m = core.merge(
    core.none('rules should just generate elements, relations and metadata'),
    {
        elements: core.flatten(),
        relations: core.flatten(),
        metadata: core.merge()
    }
);

var m2a = core.merge(
    core.none('rules should just generate elements, relations and metadata'),
    {
        elements: core.flatten(core.reduceBy(
            'id',
            core.merge(
                core.none('elements should just have the id, type, attributes and metadata fields'),
                {
                    id: core.first(),
                    type: core.single('element type field should be generated once'),
                    attributes: core.merge(),
                    metadata: core.merge()
                }
            )
        )),
        relations: core.flatten(),
        metadata: core.merge()
    }
);

var m2t = core.merge(
    core.merge(
        core.none('rules should just generate name, isFolder, content and children'),
        {
            name: core.single('rules shouldn\'t change name to elements'),
            isFolder: core.single('rules shouldn\'t change type of elements'),
            content: core.single('rules shouldn\'t change file content'),
            children: core.flatten()
        }
    )
);

function createTransformer(rules, reduce) {
    if (arguments.length < 1) { throw new core.Exception('missing rules'); }
    if (typeof rules !== 'object') {
        throw new core.Exception('invalid rules');
    }
    rules = {
        model: rules.model || [],
        element: rules.element || [],
        relation: rules.relation || []
    };
    if (arguments.length < 2) {
        reduce = m2m;
    } else if (typeof reduce === 'string') {
        switch (reduce.toLowerCase()) {
        case 'm2m':
        case 'model2model':
            reduce = m2m;
            break;
        case 'm2a':
        case 'model2almost':
            reduce = m2a;
            break;
        case 'm2t':
        case 'model2text':
            reduce = m2t;
            break;
        default:
            throw new core.Exception('unkown reduction policy "' + reduce + '"');
        }
    } else {
        if (typeof reduce !== 'function') {
            throw new core.Exception('invalid reduction policy');
        }
    }
    return core.createTransformer(function (model, emit) {
        emit(
            _(rules.model)
                .filter(function (rule) { return rule.check(model); })
                .map('execute')
                .value()
        );
        emit(
            _(rules.element)
                .flatMap(function (rule) {
                    return _(model.elements)
                        .filter(function (element) {
                            return rule.check(element, model);
                        })
                        .map(function (element) {
                            return _.partial(rule.execute, element);
                        })
                        .value();
                })
                .value()
        );
        emit(
            _(rules.relation)
                .flatMap(function (rule) {
                    return _(model.relations)
                        .filter(function (relation) {
                            return rule.check(relation, model);
                        })
                        .map(function (relation) {
                            return _.partial(rule.execute, relation);
                        })
                        .value();
                })
                .value()
        );
    }, reduce);
}

module.exports = {
    core: core,
    extend: extend,
    Exception: Exception,
    Rule: Rule,
    createRule: Rule,
    createExtender: extend.createExtender,
    createTransformer: createTransformer,
    m2a: m2a,
    m2m: m2m,
    m2t: m2t
};
