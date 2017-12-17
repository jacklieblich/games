import React, { Component } from 'react';
import Hexagon from 'react-hexagon'
class HexPiece extends Component {

  render() {
    return (
      <Hexagon
        className={this.props.piece !== 0 ? 'player' + this.props.piece : ' empty '}
        onClick={this.props.onClick}
      />
    );

  }
}

export default HexPiece;
