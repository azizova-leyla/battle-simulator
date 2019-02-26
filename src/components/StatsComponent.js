import React from 'react';

class StatusComponent extends React.Component {
  render() {
    return (<div>
      {this.renderAggregateStats(this.props.aggregatedResults)}
    </div>)
  }

  renderAggregateStats = (aggregatedResults) => {
    if (aggregatedResults.empty) {
      return;
    }
    return aggregatedResults.map(this.renderResult);
  }
  
  renderResult = (result) => {
    return (
      <div>{result.name} wins: {result.wins} ({result.wins_percent}%). 
            Average win turn: {result.avg_turn}
      </div>
    )
  }
}

export default StatusComponent;