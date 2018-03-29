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

describe('m2a | model2almost', function () {
    it('should return an empty model if no model and no rules are present', function () {
        var transform = createTransformer({}, 'm2a'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.notEqual(result, model);
        assert.deepEqual(result, model);
    });
    it('should concat elements', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            elements: {
                                id: id,
                                type: 'type.Type'
                            }
                        };
                    }
                )]
            }, 'm2a'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
            elements: [{
                id: 1,
                type: 'type.Type',
                attributes: {}
            }, {
                id: 2,
                type: 'type.Type',
                attributes: {}
            }],
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
                                id: id,
                                type: 'type.Type'
                            }]
                        };
                    }
                )]
            }, 'm2a'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
            elements: [{
                id: 1,
                type: 'type.Type',
                attributes: {}
            }, {
                id: 2,
                type: 'type.Type',
                attributes: {}
            }],
            relations: []
        });
    });
    it('should flatten merge elements with same id', function () {
        var transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return {
                            elements: [{
                                id: 'a',
                                type: 'type.Type',
                                metadata: {
                                    metadata: true
                                }
                            }, {
                                id: 'b',
                                type: 'type.Type'
                            }]
                        };
                    }
                ), createRule(
                    Rule.always,
                    function () {
                        return {
                            elements: [{
                                id: 'b',
                                attributes: {
                                    b: 2
                                }
                            }, {
                                id: 'a',
                                attributes: {
                                    a: 1
                                }
                            }]
                        };
                    }
                )]
            }, 'm2a'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
            elements: [{
                id: 'a',
                type: 'type.Type',
                attributes: {
                    a: 1
                },
                metadata: {
                    metadata: true
                }
            }, {
                id: 'b',
                type: 'type.Type',
                attributes: {
                    b: 2
                }
            }],
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
                                type: 'itself',
                                from: id,
                                to: id
                            }
                        };
                    }
                )]
            }, 'm2a'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
            elements: [],
            relations: [{
                type: 'itself',
                from: 1,
                to: 1
            }, {
                type: 'itself',
                from: 2,
                to: 2
            }]
        });
    });
    it('should flatten concat relations', function () {
        var transform = createTransformer({
                element: [createRule(
                    Rule.always,
                    function (id) {
                        return {
                            relations: [{
                                type: 'itself',
                                from: id,
                                to: id
                            }]
                        };
                    }
                )]
            }, 'm2a'),
            model = {
                elements: [1, 2],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
            elements: [],
            relations: [{
                type: 'itself',
                from: 1,
                to: 1
            }, {
                type: 'itself',
                from: 2,
                to: 2
            }]
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
            }, 'm2a'),
            model = {
                elements: [['a', 1], ['b', 2]],
                relations: []
            },
            result = transform(model);
        assert.deepEqual(result, {
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
            }, 'm2a'),
            model = {
                elements: [],
                relations: []
            };
        assert.throws(_.partial(transform, model));
    });
});
