// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
/*global describe, it*/
"use strict";

var _ = require('lodash'),
    assert = require('assert'),
    sinon = require('sinon'),
    Rule = require('../lib/rule'),
    createRule = Rule;

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
            var rule = new Rule(_.noop, _.noop);
            assert.ok(rule instanceof Rule);
        });
        it('should return a Rule if used without new', function () {
            var rule = createRule(_.noop, _.noop);
            assert.ok(rule instanceof Rule);
        });
        it('should throw without parameters', function () {
            assert.throws(function () { createRule(); });
        });
        it('should throw with invalid condition', function () {
            assert.throws(function () { createRule(undefined, _.noop); });
            assert.throws(function () { createRule(null, _.noop); });
            assert.throws(function () { createRule([], _.noop); });
            assert.throws(function () { createRule({}, _.noop); });
            assert.throws(function () { createRule('', _.noop); });
            assert.throws(function () { createRule(/ /, _.noop); });
            assert.throws(function () { createRule(0, _.noop); });
            assert.throws(function () { createRule(1, _.noop); });
        });
        it('should throw without body', function () {
            assert.throws(function () { createRule(_.noop); });
        });
        it('should throw with invalid body', function () {
            assert.throws(function () { createRule(_.noop, undefined); });
            assert.throws(function () { createRule(_.noop, null); });
            assert.throws(function () { createRule(_.noop, []); });
            assert.throws(function () { createRule(_.noop, {}); });
            assert.throws(function () { createRule(_.noop, ''); });
            assert.throws(function () { createRule(_.noop, / /); });
            assert.throws(function () { createRule(_.noop, 0); });
            assert.throws(function () { createRule(_.noop, 1); });
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
