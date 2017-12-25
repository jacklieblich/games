import React, { Component } from 'react';
import Hexagon from 'react-hexagon'
class HexPiece extends Component {

  render() {
    return (
      <Hexagon
        className={this.props.className}
        onClick={this.props.onClick}
      />
    );

  }
}

export default HexPiece;
