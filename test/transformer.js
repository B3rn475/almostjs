// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
/*global describe, it*/
"use strict";

var assert = require('assert'),
    sinon = require('sinon'),
    createTransformer = require('../lib/transformer'),
    Rule = require('../lib/rule'),
    createRule = require('../lib/rule');

describe('Transformer', function () {
    describe('creation', function () {
        it('should be a function', function () {
            assert.equal(typeof createTransformer, 'function');
        });
        it('should throw without rules', function () {
            assert.throws(function () { createTransformer(); });
        });
        it('should throw with invalid rules', function () {
            assert.throws(function () { createTransformer(undefined); });
            assert.throws(function () { createTransformer(null); });
            assert.throws(function () { createTransformer([]); });
            assert.throws(function () { createTransformer(''); });
            assert.throws(function () { createTransformer('non empty'); });
            assert.throws(function () { createTransformer(/ /); });
            assert.throws(function () { createTransformer(0); });
            assert.throws(function () { createTransformer(1); });
            assert.throws(function () { createTransformer(sinon.spy()); });
        });
        it('should throw with invalid model rules', function () {
            function test(model) {
                createTransformer({
                    model: model
                });
            }
            assert.throws(function () { test(undefined); });
            assert.throws(function () { test(null); });
            assert.throws(function () { test({}); });
            assert.throws(function () { test(''); });
            assert.throws(function () { test('non empty'); });
            assert.throws(function () { test(/ /); });
            assert.throws(function () { test(0); });
            assert.throws(function () { test(1); });
            assert.throws(function () { test(sinon.spy()); });
        });
        it('should throw with invalid element rules', function () {
            function test(element) {
                createTransformer({
                    element: element
                });
            }
            assert.throws(function () { test(undefined); });
            assert.throws(function () { test(null); });
            assert.throws(function () { test({}); });
            assert.throws(function () { test(''); });
            assert.throws(function () { test('non empty'); });
            assert.throws(function () { test(/ /); });
            assert.throws(function () { test(0); });
            assert.throws(function () { test(1); });
            assert.throws(function () { test(sinon.spy()); });
        });
        it('should throw with invalid relation rules', function () {
            function test(relation) {
                createTransformer({
                    relation: relation
                });
            }
            assert.throws(function () { test(undefined); });
            assert.throws(function () { test(null); });
            assert.throws(function () { test({}); });
            assert.throws(function () { test(''); });
            assert.throws(function () { test('non empty'); });
            assert.throws(function () { test(/ /); });
            assert.throws(function () { test(0); });
            assert.throws(function () { test(1); });
            assert.throws(function () { test(sinon.spy()); });
        });
        it('should throw with invalid reducer', function () {
            assert.throws(function () { createTransformer({}, undefined); });
            assert.throws(function () { createTransformer({}, null); });
            assert.throws(function () { createTransformer({}, {}); });
            assert.throws(function () { createTransformer({}, []); });
            assert.throws(function () { createTransformer({}, ''); });
            assert.throws(function () { createTransformer({}, 'non empty'); });
            assert.throws(function () { createTransformer({}, / /); });
            assert.throws(function () { createTransformer({}, 0); });
            assert.throws(function () { createTransformer({}, 1); });
        });
        it('should return a function', function () {
            var transform = createTransformer({});
            assert.equal(typeof transform, 'function');
        });
        it('should not invoke model rules during creation', function () {
            var check = sinon.spy(),
                body = sinon.spy(),
                rule = createRule(check, body);
            createTransformer({
                model: [rule]
            });
            assert.ok(check.notCalled);
            assert.ok(body.notCalled);
        });
        it('should not invoke element rules during creation', function () {
            var check = sinon.spy(),
                body = sinon.spy(),
                rule = createRule(check, body);
            createTransformer({
                element: [rule]
            });
            assert.ok(check.notCalled);
            assert.ok(body.notCalled);
        });
        it('should not invoke relation rules during creation', function () {
            var check = sinon.spy(),
                body = sinon.spy(),
                rule = createRule(check, body);
            createTransformer({
                relation: [rule]
            });
            assert.ok(check.notCalled);
            assert.ok(body.notCalled);
        });
    });
    describe('execution', function () {
        function emptyBody() {
            return {};
        }
        describe('model rules', function () {
            it('should execute and respect the check', function () {
                var checkAlways = sinon.spy(Rule.always),
                    checkNever = sinon.spy(Rule.never),
                    bodyAlways = sinon.spy(emptyBody),
                    bodyNever = sinon.spy(emptyBody),
                    ruleAlways = createRule(checkAlways, bodyAlways),
                    ruleNever = createRule(checkNever, bodyNever),
                    transform = createTransformer({
                        model: [ruleAlways, ruleNever]
                    });
                transform({
                    elements: [],
                    relations: []
                });
                assert.ok(checkAlways.calledOnce);
                assert.ok(checkNever.calledOnce);
                assert.ok(bodyAlways.calledOnce);
                assert.ok(bodyNever.notCalled);
            });
            it('should pass model to check', function () {
                var check = sinon.spy(Rule.never),
                    body = emptyBody,
                    rule = createRule(check, body),
                    transform = createTransformer({
                        model: [rule]
                    }),
                    model = {
                        elements: [],
                        relations: []
                    };
                transform(model);
                assert.ok(check.calledWith(model));
            });
            it('should pass model to body', function () {
                var check = Rule.always,
                    body = sinon.spy(emptyBody),
                    rule = createRule(check, body),
                    transform = createTransformer({
                        model: [rule]
                    }),
                    model = {
                        elements: [],
                        relations: []
                    };
                transform(model);
                assert.ok(body.calledWith(model));
            });
        });
        describe('element rules', function () {
            it('should not be execute with empty model', function () {
                var checkAlways = sinon.spy(Rule.always),
                    checkNever = sinon.spy(Rule.never),
                    bodyAlways = sinon.spy(emptyBody),
                    bodyNever = sinon.spy(emptyBody),
                    ruleAlways = createRule(checkAlways, bodyAlways),
                    ruleNever = createRule(checkNever, bodyNever),
                    transform = createTransformer({
                        element: [ruleAlways, ruleNever]
                    });
                transform({
                    elements: [],
                    relations: []
                });
                assert.ok(checkAlways.notCalled);
                assert.ok(checkNever.notCalled);
                assert.ok(bodyAlways.notCalled);
                assert.ok(bodyNever.notCalled);
            });
            it('should execute and respect the check', function () {
                var checkAlways = sinon.spy(Rule.always),
                    checkNever = sinon.spy(Rule.never),
                    bodyAlways = sinon.spy(emptyBody),
                    bodyNever = sinon.spy(emptyBody),
                    ruleAlways = createRule(checkAlways, bodyAlways),
                    ruleNever = createRule(checkNever, bodyNever),
                    transform = createTransformer({
                        element: [ruleAlways, ruleNever]
                    });
                transform({
                    elements: [{}],
                    relations: []
                });
                assert.ok(checkAlways.calledOnce);
                assert.ok(checkNever.calledOnce);
                assert.ok(bodyAlways.calledOnce);
                assert.ok(bodyNever.notCalled);
            });
            it('should pass elements and model to check', function () {
                var check = sinon.spy(Rule.never),
                    body = emptyBody,
                    rule = createRule(check, body),
                    transform = createTransformer({
                        element: [rule]
                    }),
                    element1 = {},
                    element2 = {},
                    model = {
                        elements: [element1, element2],
                        relations: []
                    };
                transform(model);
                assert.ok(check.calledTwice);
                assert.ok(check.calledWith(element1, model));
                assert.ok(check.calledWith(element2, model));
            });
            it('should pass elements and model to body', function () {
                var check = Rule.always,
                    body = sinon.spy(emptyBody),
                    rule = createRule(check, body),
                    transform = createTransformer({
                        element: [rule]
                    }),
                    element1 = {},
                    element2 = {},
                    model = {
                        elements: [element1, element2],
                        relations: []
                    };
                transform(model);
                assert.ok(body.calledTwice);
                assert.ok(body.calledWith(element1, model));
                assert.ok(body.calledWith(element2, model));
            });
        });
        describe('relation rules', function () {
            it('should not be execute with empty model', function () {
                var checkAlways = sinon.spy(Rule.always),
                    checkNever = sinon.spy(Rule.never),
                    bodyAlways = sinon.spy(emptyBody),
                    bodyNever = sinon.spy(emptyBody),
                    ruleAlways = createRule(checkAlways, bodyAlways),
                    ruleNever = createRule(checkNever, bodyNever),
                    transform = createTransformer({
                        relation: [ruleAlways, ruleNever]
                    });
                transform({
                    elements: [],
                    relations: []
                });
                assert.ok(checkAlways.notCalled);
                assert.ok(checkNever.notCalled);
                assert.ok(bodyAlways.notCalled);
                assert.ok(bodyNever.notCalled);
            });
            it('should execute and respect the check', function () {
                var checkAlways = sinon.spy(Rule.always),
                    checkNever = sinon.spy(Rule.never),
                    bodyAlways = sinon.spy(emptyBody),
                    bodyNever = sinon.spy(emptyBody),
                    ruleAlways = createRule(checkAlways, bodyAlways),
                    ruleNever = createRule(checkNever, bodyNever),
                    transform = createTransformer({
                        relation: [ruleAlways, ruleNever]
                    });
                transform({
                    elements: [],
                    relations: [{}]
                });
                assert.ok(checkAlways.calledOnce);
                assert.ok(checkNever.calledOnce);
                assert.ok(bodyAlways.calledOnce);
                assert.ok(bodyNever.notCalled);
            });
            it('should pass elements and model to check', function () {
                var check = sinon.spy(Rule.never),
                    body = emptyBody,
                    rule = createRule(check, body),
                    transform = createTransformer({
                        relation: [rule]
                    }),
                    relation1 = {},
                    relation2 = {},
                    model = {
                        elements: [],
                        relations: [relation1, relation2]
                    };
                transform(model);
                assert.ok(check.calledTwice);
                assert.ok(check.calledWith(relation1, model));
                assert.ok(check.calledWith(relation2, model));
            });
            it('should pass elements and model to body', function () {
                var check = Rule.always,
                    body = sinon.spy(emptyBody),
                    rule = createRule(check, body),
                    transform = createTransformer({
                        relation: [rule]
                    }),
                    relation1 = {},
                    relation2 = {},
                    model = {
                        elements: [],
                        relations: [relation1, relation2]
                    };
                transform(model);
                assert.ok(body.calledTwice);
                assert.ok(body.calledWith(relation1, model));
                assert.ok(body.calledWith(relation2, model));
            });
        });
    });
});
