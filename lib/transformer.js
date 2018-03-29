// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    core = require('almost-core'),
    createRule = require('./rule'),
    m2m = require('./model2model'),
    m2a = require('./model2almost'),
    m2t = require('./model2text');

function createTransformer(rules, reduce) {
    if (arguments.length < 1) { throw new core.Exception('missing rules'); }
    if (!_.isPlainObject(rules)) { throw new core.Exception('invalid rules, it should be an object'); }
    if (_.has(rules, 'model') && !_.isArray(rules.model)) { throw new core.Exception('invalid rules, invalid model field, it should be an array'); }
    if (_.has(rules, 'element') && !_.isArray(rules.element)) { throw new core.Exception('invalid rules, invalid element field, it should be an array'); }
    if (_.has(rules, 'relation') && !_.isArray(rules.relation)) { throw new core.Exception('invalid rules, invalid relation field, it should be an array'); }

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
    } else if (typeof reduce !== 'function') {
        throw new core.Exception('invalid reduction policy');
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

module.exports = createTransformer;
