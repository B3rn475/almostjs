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

describe('m2t | model2text', function () {
    it('should return an empty object', function () {
        var transform = createTransformer({}, 'm2t'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {});
    });
    it('should return a model copy', function () {
        var partial = {
                a: {name: 'a', isFolder: true, children: ['b']},
                b: {name: 'b', content: 'File Content'}
            },
            transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return partial;
                    }
                )]
            }, 'm2t'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, partial);
    });
    it('should merge top level objects', function () {
        var transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return {
                            a: {name: 'a', isFolder: true, children: ['b']}
                        };
                    }
                ), createRule(
                    Rule.always,
                    function () {
                        return {
                            b: {name: 'b', content: 'File Content'}
                        };
                    }
                )]
            }, 'm2t'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            a: {name: 'a', isFolder: true, children: ['b']},
            b: {name: 'b', content: 'File Content'}
        });
    });
    it('should merge single entities', function () {
        var transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return {
                            a: {name: 'a'},
                            b: {name: 'b'}
                        };
                    }
                ), createRule(
                    Rule.always,
                    function () {
                        return {
                            a: {isFolder: true, children: ['b']},
                            b: {content: 'File Content'}
                        };
                    }
                )]
            }, 'm2t'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            a: {name: 'a', isFolder: true, children: ['b']},
            b: {name: 'b', content: 'File Content'}
        });
    });
    it('should concat children', function () {
        var transform = createTransformer({
                model: [createRule(
                    Rule.always,
                    function () {
                        return {
                            a: {name: 'a', isFolder: true, children: ['b']}
                        };
                    }
                ), createRule(
                    Rule.always,
                    function () {
                        return {
                            a: {children: ['c']},
                        };
                    }
                )]
            }, 'm2t'),
            model = {
                elements: [],
                relations: []
            },
            result = transform(model);
        assert.deepStrictEqual(result, {
            a: {name: 'a', isFolder: true, children: ['b', 'c']}
        });
    });
});
