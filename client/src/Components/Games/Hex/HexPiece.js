import React, { Component } from 'react';
import Hexagon from 'react-hexagon'
class HexPiece extends Component {

	updateDimensions() {
        this.setState({width: window.innerWidth});
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

  render() {
  	console.log(this.state)
    return (
      <Hexagon
        className={this.props.className}
        onClick={this.props.onClick}
        flatTop={this.state.width > 767 ? false : true}
      />
    );

  }
}

export default HexPiece;
