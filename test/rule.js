// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
/*global describe, it*/
"use strict";

var assert = require('assert'),
    sinon = require('sinon'),
    Rule = require('../lib/rule'),
    createRule = Rule;

function noop() { return undefined; }

describe('Rule', function () {
    it('should be a function', function () {
        assert.equal(typeof Rule, 'function');
    });
    describe('Helpers', function () {
        it('should be functions', function () {
            assert.equal(typeof Rule.always, 'function');
            assert.equal(typeof Rule.never, 'function');
        });
        it('should return true', function () {
            assert.ok(Rule.always());
        });
        it('should return false', function () {
            assert.ok(!Rule.never());
        });
    });
    describe('Creation', function () {
        it('should return a Rule if used with new', function () {
            var rule = new Rule(noop, noop);
            assert.ok(rule instanceof Rule);
        });
        it('should return a Rule if used without new', function () {
            var rule = createRule(noop, noop);
            assert.ok(rule instanceof Rule);
        });
        it('should throw if no condition', function () {
            assert.throws(function () { createRule(undefined, noop); });
            assert.throws(function () { createRule(null, noop); });
            assert.throws(function () { createRule([], noop); });
            assert.throws(function () { createRule({}, noop); });
            assert.throws(function () { createRule('', noop); });
            assert.throws(function () { createRule(/ /, noop); });
            assert.throws(function () { createRule(0, noop); });
            assert.throws(function () { createRule(1, noop); });
        });
        it('should throw if no body', function () {
            assert.throws(function () { createRule(noop); });
            assert.throws(function () { createRule(noop, undefined); });
            assert.throws(function () { createRule(noop, null); });
            assert.throws(function () { createRule(noop, []); });
            assert.throws(function () { createRule(noop, {}); });
            assert.throws(function () { createRule(noop, ''); });
            assert.throws(function () { createRule(noop, / /); });
            assert.throws(function () { createRule(noop, 0); });
            assert.throws(function () { createRule(noop, 1); });
        });
        it('should not invoke parameters during initialization', function () {
            var condition = sinon.spy(),
                body = sinon.spy();
            createRule(condition, body);
            assert.ok(!condition.called);
            assert.ok(!body.called);
        });
    });
});
