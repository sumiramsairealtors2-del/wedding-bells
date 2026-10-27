import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erasedFraction, shouldReveal } from '../public/wedding/js/scratch.mjs';
test('40% threshold', () => { assert.equal(shouldReveal(.399), false); assert.equal(shouldReveal(.4), true); });
test('alpha coverage measurement', () => { assert.equal(erasedFraction(new Uint8ClampedArray([0,0,0,255])), 0); assert.equal(erasedFraction(new Uint8ClampedArray([0,0,0,0])), 1); });
