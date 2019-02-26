import './App.css';
import simulation from './Simulation.js'
import StatsComponent from './components/StatsComponent.js'
import statsHelpers from './StatsHelpers.js'
import React, { Component } from 'react';

class Unit extends React.Component {
  handleInputChange = (event) => {
    const { value, name } = event.currentTarget;
    let parsedValue = value;
    if (name !== 'name') {
      if (parsedValue !== '' && parsedValue !== '-') {
        parsedValue = Number(value) ? Number(value) : 0;
      }
    }
    const newStats = {
      ...this.props.values,
      [name]: parsedValue
    };

    this.props.onChange(this.props.unitKey, newStats);
  };
  
  render() {
    return (
      <div>
        <div>{this.props.unitKey}</div>
        {this.renderInputs()}
      </div>
    );
  }

  renderInputs = () => {
    return Object.keys(this.props.values).map(this.renderInput);
  };

  renderInput = (statName) => {
    return (
      <div key={statName}>
        <label>
          {statName}{' '}
          <input
            type="text"
            value={this.props.values[statName]}
            name={statName}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    );
  };
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      results: {
        empty: true
      },
      numGames: 1,
      unit1: {
        name: 'Phalanx',
        green: 6,
        yellow: 2,
        red: 2,
        dice: 5,
        attack: 7,
        power: 5,
        defense: 2,
        toughness: 2,
        courage: 12,
        range: 0,
        speed: 3.5,
        fear_level: 1,
        charging_dice_mod: 2,
        charging_attack_mod: 1,
        charging_power_mod: -1,
        charging_defense_mod: -1,
        charging_toughness_mod: 2,
        impact_hits: 1
      },
      unit2: {
        name: 'Orc Axemen',
        green: 5,
        yellow: 3,
        red: 2,
        dice: 5,
        attack: 6,
        power: 6,
        defense: 1,
        toughness: 3,
        courage: 13,
        range: 0,
        speed: 3.5,
        fear_level: 1,
        charging_dice_mod: 0,
        charging_attack_mod: 0,
        charging_power_mod: 0,
        charging_defense_mod: 0,
        charging_toughness_mod: 0,
        impact_hits: 0
      }
    };
  }

  handleSimulateClick = () => {
    const results = simulation.simulateMany(
      this.state.unit1, 
      this.state.unit2, 
      this.state.numGames);
    const unit1_wins = statsHelpers.winsPerUnit(results, 
                                                this.state.unit1.name,
                                                this.state.numGames);
    const unit2_wins = statsHelpers.winsPerUnit(results, 
                                                this.state.unit2.name, 
                                                this.state.numGames);
    const draws = statsHelpers.winsPerUnit(results, 
                                            'draw',
                                            this.state.numGames);
    this.setState({
      results: [unit1_wins, unit2_wins, draws]
    });
  };

  handleUnitPropertyValueChange = (unitKey, newStats) => {
    this.setState({
      [unitKey]: newStats
    });
  };

  handleNumGamesChange = (event) => {
    const value = event.currentTarget.value;
    const numGames = Number(value) ? Number(value) : 0;
    this.setState({
      numGames
    });
  }

  render() {
    return (
      <div className = 'App'>
        <h1>Battle simulator</h1>
        <div>        
          <label>
            Number of games: 
            <input
              type="text"
              value={this.state.numGames}
              name="numGames"
              onChange={this.handleNumGamesChange}
            />
          </label>
        </div>
        <div className = 'box'>
          <div className="half-page-box">{this.renderUnit(this.state.unit1, 'unit1')}</div>
          <div className="half-page-box">{this.renderUnit(this.state.unit2, 'unit2')}</div>
        </div>
        <button className = "myButton" onClick={this.handleSimulateClick}>Simulate</button>
        <h2>Simulation results</h2>
        <div><StatsComponent aggregatedResults={this.state.results} /></div>
      </div>
    );
  }

  renderUnit = (stats, unitKey) => {
    return <Unit
      values={stats}
      unitKey={unitKey}
      onChange={this.handleUnitPropertyValueChange}
    />;
  };
}

export default App;
