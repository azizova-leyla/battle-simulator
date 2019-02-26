import courageCheckHelpers from './CourageChecksHelpers.js'
import combat from './CombatHelpers.js'
import unitHelpers from './UnitHelpers.js'

const simulation = {
  simulateMany(unit1, unit2, n) {
    let allResults=[];
    for (let i = 0; i < n; i++) {
      const result = this.simulateGame(unit1, unit2);
      allResults.push(result);
    }
    return allResults;
  },
  simulateGame(unit1, unit2) {
    let distance = 0.25;
    let turn = 0;
    let activeUnit = this.parseUnit(unit1);
    let passiveUnit = this.parseUnit(unit2);
    while (turn < 200) {
      turn = turn + 1;
      const new_state = this.simulateTurn(activeUnit, passiveUnit, distance);
      if (unitHelpers.isDeadOrRouting(new_state.activeUnit) &&
          unitHelpers.isDeadOrRouting(new_state.passiveUnit)) {
        return {
          turns: turn, winner: 'draw', loser_order: new_state.activeUnit.order
        }
      }
      else if (unitHelpers.isDeadOrRouting(new_state.activeUnit)) {
        return {
          turns: turn, winner: passiveUnit.name, loser_order: new_state.activeUnit.order
        }
      }
      else if (unitHelpers.isDeadOrRouting(new_state.passiveUnit)) {
        return {
          turns: turn, winner: activeUnit.name, loser_order: new_state.passiveUnit.order
        }
      }

      activeUnit = new_state.passiveUnit;
      passiveUnit = new_state.activeUnit;
      distance = new_state.distance;
    }
    return {
      turns: turn, winner: 'not sure'
    }
  },

  simulateTurn(activeUnit, passiveUnit, distance) {
    let isCharging = false;
    let newDistance = distance;
    if (distance > 0) {
      newDistance = Math.max(0.0, distance - activeUnit.speed);
      if (newDistance < 0.1) {
        isCharging = true;
      }
    }
    const newState = this.resolveCombatPhase(activeUnit, passiveUnit, isCharging, distance)
    return {
      activeUnit: newState.activeUnit,
      passiveUnit: newState.passiveUnit,
      distance: newDistance
    };
  },

  // Make turn
  resolveCombatPhase(activeUnit, passiveUnit, isCharging, distance) {
    if (isCharging) {
      activeUnit = courageCheckHelpers.resolveFearCheck(activeUnit, passiveUnit);
      passiveUnit = courageCheckHelpers.resolveFearCheck(passiveUnit, activeUnit);
    }
    if (combat.canAttack(activeUnit, distance)) {
      const damage = combat.calculateDamage(activeUnit, passiveUnit, isCharging);
      passiveUnit = unitHelpers.applyDamage(passiveUnit, damage);
    }
    if (combat.canAttack(passiveUnit, distance)) {
      const damage = combat.calculateDamage(passiveUnit, activeUnit, isCharging);
      activeUnit = unitHelpers.applyDamage(activeUnit, damage);
    }
    activeUnit = courageCheckHelpers.resolveRoutCheck(activeUnit);
    passiveUnit = courageCheckHelpers.resolveRoutCheck(passiveUnit);
    return {activeUnit: activeUnit, passiveUnit: passiveUnit};
  },

  parseUnit(unit) {
    return {
      ...unit,
      life_boxes: [Number(unit.green), Number(unit.yellow), Number(unit.red)]
    };
  }
};

export default simulation;