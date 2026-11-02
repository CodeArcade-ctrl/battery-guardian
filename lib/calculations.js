'use strict';
function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number.`);
  return value;
}
function positive(value, name) {
  nonNegative(value, name);
  if (value === 0) throw new Error(`${name} must be greater than zero.`);
  return value;
}
function percentage(value, name) {
  nonNegative(value, name);
  if (value > 100) throw new Error(`${name} must be between 0 and 100.`);
  return value;
}
function runtime(capacityWh, socPercent, loadW) {
  const energyWh = positive(capacityWh, 'Usable battery capacity') * percentage(socPercent, 'Charge level') / 100;
  const hours = energyWh / positive(loadW, 'Current load');
  return { runtime_hours: hours, runtime_minutes: hours * 60, remaining_energy_wh: energyWh };
}
function chargeTime(capacityWh, currentPercent, targetPercent, chargePowerW) {
  const capacity = positive(capacityWh, 'Battery capacity');
  const current = percentage(currentPercent, 'Current charge');
  const target = percentage(targetPercent, 'Target charge');
  const missingWh = capacity * Math.max(0, target - current) / 100;
  return { charge_time_hours: missingWh / positive(chargePowerW, 'Charging power'), energy_needed_wh: missingWh };
}
function usableEnergy(capacityWh, socPercent, reservePercent) {
  const capacity = positive(capacityWh, 'Usable battery capacity');
  const soc = percentage(socPercent, 'Charge level');
  const reserve = percentage(reservePercent, 'Reserve level');
  return { usable_energy_wh: capacity * Math.max(0, soc - reserve) / 100, below_reserve: soc < reserve };
}
function belowReserve(socPercent, reservePercent) {
  return percentage(socPercent, 'Charge level') < percentage(reservePercent, 'Reserve level');
}
function runtimeBelow(capacityWh, socPercent, loadW, limitHours) {
  nonNegative(limitHours, 'Runtime threshold');
  return runtime(capacityWh, socPercent, loadW).runtime_hours < limitHours;
}
module.exports = { runtime, chargeTime, usableEnergy, belowReserve, runtimeBelow };
