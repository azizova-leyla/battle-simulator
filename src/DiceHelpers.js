const diceHelpers = {
  rollDie() {
    const roll = Math.floor(Math.random() * 6) + 1;
    return roll;
  }
}

export default diceHelpers;