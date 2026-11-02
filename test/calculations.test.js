'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const c = require('../lib/calculations');
test('runtime converts usable battery energy into hours and minutes', () => {
  assert.deepEqual(c.runtime(1000, 50, 250), { runtime_hours: 2, runtime_minutes: 120, remaining_energy_wh: 500 });
});
test('charge estimate handles a lower target without negative time', () => {
  assert.equal(c.chargeTime(2000, 80, 50, 500).charge_time_hours, 0);
  assert.equal(c.chargeTime(2000, 20, 70, 500).charge_time_hours, 2);
});
test('reserve calculation protects the configured reserve', () => {
  assert.deepEqual(c.usableEnergy(4000, 60, 20), { usable_energy_wh: 1600, below_reserve: false });
  assert.equal(c.belowReserve(10, 20), true);
});
test('zero power and invalid percentages are rejected', () => {
  assert.throws(() => c.runtime(1000, 50, 0));
  assert.throws(() => c.belowReserve(101, 20));
});
