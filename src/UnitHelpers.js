import * as constants from './Constants.js'

const unitHelpers = {
  getCourage(unit) {
    let courage = unit.courage;
    if (unit.temp_courage_mod != null) {
      courage = courage + unit.temp_courage_mod;
    }
    if (this.inTheYellow(unit)) {
      return courage - 1;
    }
    if (this.inTheRed(unit)) {
      return courage - 2;
    }
  },

  isDead(unit) {
    return unit.life_boxes.reduce((a, b) => {
      return a + b;
    }, 0) === 0;
  },

  isDeadOrRouting(unit) {
    return unitHelpers.isDead(unit) || unit.order === constants.order.ROUT;
  },

  applyDamage(unit, damage) {
    const new_life_boxes = unit.life_boxes;
    let needs_rout_check = false
    let new_order = unit.order
    if (damage > 0) {
      for (let i = 0; i < 3; i++) {
        if (unit.life_boxes[i] > 0) {
          let to_check = Math.min(unit.life_boxes[i], damage);
          if (to_check > 0 && i === 2) {
            unit.needs_rout_check = true;
          }
          new_life_boxes[i] = unit.life_boxes[i] - to_check;
          damage = damage - to_check;
          if (new_life_boxes[i] === 0) {
            if (i === 2) {
              new_order = constants.order.DEAD;
            }
            needs_rout_check = true;
          }
        }
      }
    }
    return {...unit,
      life_boxes: new_life_boxes,
      needs_rout_check,
      order: new_order};
  },

  inTheRed(unit) {
    return unit.life_boxes[0] === 0 && unit.life_boxes[1] === 0;
  },

  inTheYellow(unit) {
    return unit.life_boxes[0] === 0 && unit.life_boxes[1] > 0;
  },

  getDice(unit, isCharging) {
    let baseDice = unit.dice;
    if (this.inTheYellow(unit)) {
      baseDice = baseDice - 1;
    }
    if (this.inTheRed(unit)) {
      baseDice = baseDice - 2;
    }
    if (isCharging) {
      baseDice = baseDice + unit.charging_dice_mod;
    }
    return Math.max(0, baseDice);
  },

  getAttackStat(unit, isCharging) {
    if (isCharging) {
      return Math.max(0, unit.attack + unit.charging_attack_mod);
    }
    return unit.attack;
  },


  getPowerStat(unit, isCharging) {
    if (isCharging) {
      return Math.max(0, unit.power + unit.charging_power_mod);
    }
    return unit.power;
  },


  getDefenseStat(unit, isCharging) {
    if (isCharging) {
      return Math.max(0, unit.defense + unit.charging_defense_mod);
    }
    return unit.defense;
  },


  getToughnessStat(unit, isCharging) {
    if (isCharging) {
      return Math.max(unit.toughness + unit.charging_toughness_mod);
    }
    return unit.toughness;
  },


  getImpactHits(unit, isCharging) {
    if (!isCharging) {
      return 0;
    }
    return unit.impact_hits;
  }
};

export default unitHelpers;
