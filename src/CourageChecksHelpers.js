import * as constants from './Constants.js'
import diceHelpers from './DiceHelpers.js'
import unitHelpers from './UnitHelpers.js'

const courageChecksHelpers = {
  resolveFearCheck(unit1, unit2) {
    if (unit2.fear_level === constants.fearLevel.TERRIFYING && 
      unit1.fear_level === constants.fearLevel.NORMAL) {
        return {
          ...unit1,
          temp_courage_mod: -1
        };
      }
    return unit1;
  },

  resolveRoutCheck(unit) {
    if (unit.needs_rout_check) {
      if (this.rollCourage() > unitHelpers.getCourage(unit)) {
        return {
          ...unit,
          order: constants.order.ROUT
        };
      } else {
        return {
          ...unit,
          needs_rout_check: false
        }
      }
    }
    return unit;
  },

  rollCourage() {
    return diceHelpers.rollDie() + diceHelpers.rollDie() + diceHelpers.rollDie();
  }
}

export default courageChecksHelpers;