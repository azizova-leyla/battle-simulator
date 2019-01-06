import './App.css';
import simulation from './Simulation.js'
import React, { Component } from 'react';

class Unit extends React.Component {
  handleInputChange = (event) => {
    const { value, name } = event.currentTarget;
    const newStats = {
      ...this.props.values,
      [name]: value
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
        turns: 0,
        winner: 'press button to start simulation',
      },
      unit1: {
        name: 'Unit 1',
        green: 2,
        yellow: 4,
        red: 4,
        dice: 5,
        attack: 4,
        power: 3,
        defense: 2,
        toughness: 1,
        courage: 12,
        range: 0,
        speed: 3.5,
        fear_level: 1,
        impact_hits: 0
      },
      unit2: {
        name: 'Unit 2',
        green: 2,
        yellow: 4,
        red: 4,
        dice: 5,
        attack: 4,
        power: 3,
        defense: 2,
        toughness: 1,
        courage: 12,
        range: 0,
        speed: 3.5,
        fear_level: 1,
        impact_hits: 0
      }
    };
  }

  handleSimulateClick = () => {
    const results = simulation.simulateGame(this.state.unit1, this.state.unit2);

    this.setState({
      results
    });
  };

  handleUnitPropertyValueChange = (unitKey, newStats) => {
    this.setState({
      [unitKey]: newStats
    });
  };

  render() {
    console.log(this.state.results);
    return (
      <div className = 'App'>
        <header className = 'App-header'>
          <h1>Battle simulator</h1>
          <div>{this.renderUnit(this.state.unit1, 'unit1')}</div>
          <div>{this.renderUnit(this.state.unit2, 'unit2')}</div>
          <button onClick={this.handleSimulateClick}>Simulate</button>
          <h2>Simulation results</h2>
          <div>Turns: {this.state.results.turns}</div>
          <div> Winner: {this.state.results.winner}</div>
          <div>Loser order: {this.state.results.loser_order} </div>
        </header>
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
