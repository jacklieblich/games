import React from "react";
import Client from "../../api";
import { Link } from 'react-router-dom';
import { Spinner } from '../Spinner';

class GamePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTypes: [],
      loading: true
    };
    this.gamePicker = this.gamePicker.bind(this);
    this.getGameTypes();
  }

  getGameTypes() {
    Client.gameTypes().then((gameTypes) => {
      this.setState({gameTypes})
      this.setState({loading: false})
  })
  }

  gamePicker() {
    return(
      <div>
        <h3>Select Game</h3>
        <div className="game-picker">
        {this.state.gameTypes.map((gameType) => {
            const withSpaces = gameType.replace( /([A-Z])/g, " $1" );
            const capitalized = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
            return(
              <Link to={"/challenge/" + gameType} className="game-button-wrapper">
                <h1>{capitalized}</h1>
                <div className={`button ${gameType}`} onClick={() => this.setState({selectedGameType: gameType})} key={gameType}></div>
              </Link>
            )
          }
        )}
        </div>
      </div>
    );
  }

  render() {

    if(this.state.loading) {
      return Spinner()
    }

    return (
          <div className="challenge-form">
          {this.gamePicker()}
          <Link to="/" className="btn bottom back-button">Back</Link>
          </div>
    );
  }
}

export default GamePicker;
