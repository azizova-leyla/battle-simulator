import diceHelpers from './DiceHelpers.js'
import unitHelpers from './UnitHelpers.js'

const combatHelpers = {
  canAttack(unit1, distance) {
    return unit1.range <= distance;
  },

  calculateDamage(attackingUnit, defendingUnit, isCharging) {
    let attackStat = this.makeAttackStat(attackingUnit, isCharging);
    let defenseStat = this.makeDefenseStat(defendingUnit);
    return this.rollAttack(attackStat, defenseStat)
  },

  makeAttackStat(unit, isCharging) {
    return {
      dice: unitHelpers.getDice(unit, isCharging),
      impact_hits: unitHelpers.getImpactHits(unit, isCharging),
      attack: unitHelpers.getAttackStat(unit, isCharging),
      power: unitHelpers.getPowerStat(unit, isCharging),
    }
  },

  makeDefenseStat(unit, isCharging) {
    return {
      defense: unitHelpers.getDefenseStat(unit, isCharging),
      toughness: unitHelpers.getToughnessStat(unit, isCharging)
    }
  },

  rollAttack(attackStat, defenseStat) {
    let hits = 0;
    for (let i = 0; i < attackStat.dice; i++) {
      let dieRoll = diceHelpers.rollDie();
      if (dieRoll === 1) {
        hits++;
      } else if (dieRoll <= (attackStat.attack - defenseStat.defense)) {
        hits++;
      }
    }

    hits = hits + attackStat.impact_hits;

    let damage = 0
    for (let i = 0; i < hits; i++) {
      let dieRoll = diceHelpers.rollDie();
      if (dieRoll === 1) {
        damage++;
      } else if (dieRoll <= (attackStat.power - defenseStat.toughness)) {
        damage++;
      }
    }
    return damage;
  }
};

export default combatHelpers;