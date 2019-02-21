const statHelpers = {
  winsPerUnit(results, unitName, n) {
    const total = results.reduce(
        (total,
         result) => {return total + (result.winner === unitName ? 1 : 0)},
        0);
    const turn = results.reduce(
        (turn, result) => {return turn +
                           (result.winner === unitName ? result.turns : 0)},
        0);
    return {
      name: unitName,
      wins: total,
      wins_percent: total * 100.0 / n,
      avg_turn: total > 0 ? turn / total : 0
    }
  },
  winsPerUnitPerTurn(results) {
    return results.reduce((winTurns, results) => {
      winTurns[results.winner][results.turn] += 1;
      return winTurns;
    }, {});
  }
}

export default statHelpers;