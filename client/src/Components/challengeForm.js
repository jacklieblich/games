import React from "react";
import Client from "../api";
import { Link, Redirect } from 'react-router-dom';
import { Flash } from './flash';
import { Spinner } from './Spinner';

class ChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      gameTypes: [],
      selectedGameType: "",
      loading: true,
      newGameId: null
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
      this.setState({loading: false})
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
          {this.state.users.map((userInfo) => <div className="opponent" onClick={() => {
            Client.challenge(
              userInfo.user.id,
              this.state.selectedGameType,
              (response) => this.setState({newGameId: response.gameId}),
              (errors) => {
                this.setState({newGameId: "error"})
                errors.response.json().then(response => Flash.errors = response)
              }
            )
          }} key={userInfo.user.id}>
            <p className="username">{userInfo.user.username}</p>
            <div className="user-image">
              {userInfo.user.uid && <img src={`https://graph.facebook.com/v2.11/${userInfo.user.uid}/picture?type=normal`}/>}
            </div>
            <p className="record">{userInfo.record.wins + " - " + userInfo.record.losses + " - " + userInfo.record.ties}</p>
          </div>)}
        </div>
      </div>
    );
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
              <div className="game-button-wrapper">
                <h1>{capitalized}</h1>
                <div className={`button ${gameType}`} onClick={() => this.setState({selectedGameType: gameType})} key={gameType}></div>
              </div>
            )
          }
        )}
        </div>
      </div>
    );
  }

  renderGame() {

  }

  render() {
    if(this.state.newGameId){
      if(this.state.newGameId === "error"){
        return <Redirect to="/" />
      }
      return <Redirect to={"/games/" + this.state.selectedGameType +"/" + this.state.newGameId} />
    }

    if(this.state.loading) {
      return Spinner()
    }

    let step = this.gamePicker

    if (this.state.selectedGameType !== "") {
      step = this.playerPicker
    }

    return (
          <div className="challenge-form">
          {step()}
          <Link to="/" className="btn back-button">Back</Link>
          </div>
    );
  }
}

export default ChallengeForm;
