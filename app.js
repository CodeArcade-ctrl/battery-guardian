'use strict';
const Homey = require('homey');
const calculations = require('./lib/calculations');

class App extends Homey.App {
  async onInit() {
    this.homey.flow.getActionCard('estimate_runtime')
      .registerRunListener(async args => calculations.runtime(args.capacity_wh, args.soc_percent, args.load_w));
    this.homey.flow.getActionCard('estimate_charge_time')
      .registerRunListener(async args => calculations.chargeTime(args.capacity_wh, args.current_percent, args.target_percent, args.charge_power_w));
    this.homey.flow.getActionCard('calculate_reserve')
      .registerRunListener(async args => calculations.usableEnergy(args.capacity_wh, args.soc_percent, args.reserve_percent));
    this.homey.flow.getConditionCard('below_reserve')
      .registerRunListener(async args => calculations.belowReserve(args.soc_percent, args.reserve_percent));
    this.homey.flow.getConditionCard('runtime_below')
      .registerRunListener(async args => calculations.runtimeBelow(args.capacity_wh, args.soc_percent, args.load_w, args.limit_hours));
  }
}

module.exports = App;
