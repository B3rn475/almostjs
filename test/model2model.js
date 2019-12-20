// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
/*global describe, it*/
"use strict";

var _ = require('lodash'),
    assert = require('assert'),
    createTransformer = require('../lib/transformer'),
    Rule = require('../lib/rule'),
    createRule = require('../lib/rule');

describe('m2m | model2model', function () {
    it('should return an empty model if no model and no rules are present', function () {
        var transform = createTransformer({}, 'm2m'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.notEqual(result, model);
        assert.deepStrictEqual(result, model);
    });
    it('should concat elements', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            elements: {
                                id: id
                            }
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            elements: [{id: 1}, {id: 2}],
            relations: []
        });
    });
    it('should flatten concat elements', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            elements: [{
                                id: id
                            }]
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            elements: [{id: 1}, {id: 2}],
            relations: []
        });
    });
    it('should concat relations', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            relations: {
                                id: id
                            }
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            elements: [],
            relations: [{id: 1}, {id: 2}]
        });
    });
    it('should flatten concat relations', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            relations: [{
                                id: id
                            }]
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            elements: [],
            relations: [{id: 1}, {id: 2}]
        });
    });
    it('should merge metadata', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (pack) {
                        var metadata = {};
                        metadata[pack[0]] = pack[1];
                        return {
                            metadata: metadata
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [['a', 1], ['b', 2]],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            elements: [],
            relations: [],
            metadata: {
                a: 1,
                b: 2
            }
        });
    });
    it('should throw with invalid partial model', function () {
        var transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return {
                            invalid: true
                        };
                    }
                )]
            }, 'm2m'),
            model = {
                elements: [],
                relations: []
            };
        assert.throws(_.partial(transform, model));
    });
});
