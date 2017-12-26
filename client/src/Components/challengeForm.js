import React from "react";
import Client from "../api";
import { Link } from 'react-router-dom';
import { Flash } from './flash';

class ChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      gameTypes: [],
      selectedGameType: ""
    };
    this.handleGameChange = this.handleGameChange.bind(this);
    this.playerPicker = this.playerPicker.bind(this);
    this.gamePicker = this.gamePicker.bind(this);
    this.getOtherUsers();
    this.getGameTypes();
  }

  getGameTypes() {
    Client.gameTypes().then((gameTypes) => {
      this.setState({gameTypes})
  })
  }

  getOtherUsers() {
    Client.otherUsers((users) =>{
      this.setState({users: users})
    })
  }

  handleGameChange(event) {
    this.setState({selectedGameType: event.target.value})
  }

  playerPicker() {
    return(
      <div>
        <h3>Select Opponent</h3>
        <div className="opponent-picker">
          {this.state.users.map((userInfo) => <Link to="/" onClick={() => {
            Client.challenge(
              userInfo.user.id,
              this.state.selectedGameType,
              (errors) => errors.response.json().then(response => Flash.errors = response)
            )
          }} key={userInfo.user.id}>
            {userInfo.user.username} <br />  {userInfo.record.wins + " - " + userInfo.record.losses + " - " + userInfo.record.ties}
          </Link>)}
        </div>
      </div>
    );
  }

  gamePicker() {
    return(
      <div>
        <h3>Select Game</h3>
        <div className="game-picker">
        {this.state.gameTypes.map((gameType) => <div className="game-button-wrapper">{gameType}<div className={`button ${gameType}`} onClick={() => this.setState({selectedGameType: gameType})} key={gameType}></div></div>)}
        </div>
      </div>
    );
  }

  render() {
    let step = this.gamePicker
    if (this.state.selectedGameType !== "") {
      step = this.playerPicker
    }
    return (
          <div className="challenge-form">
          {step()}
          </div>
    );
  }
}

export default ChallengeForm;
