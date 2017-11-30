import React from "react";
import Client from "./client";

class ChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: "",
      gameTypes: [],
      selectedGameType: ""
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleGameChange = this.handleGameChange.bind(this);
    this.handleSubmit = props.handleSubmit;
    this.getOtherUsers();
    this.getGameTypes();
  }

  getGameTypes() {
    Client.gameTypes().then((gameTypes) => {
      this.setState({gameTypes})
      if(gameTypes.length > 0){
        this.setState({selectedGameType: gameTypes[0]})
      }
  })
  }

  getOtherUsers() {
    Client.otherUsers((users) =>{
      this.setState({users: users})
      if(users.length > 0){
        this.setState({selectedUser: users[0].id})
      }
    })
  }

  handleUserChange(event) {
    this.setState({selectedUser: event.target.value});
  }

  handleGameChange(event) {
    this.setState({selectedGameType: event.target.value})
  }

  onSubmit(event) {
    event.preventDefault();
    this.handleSubmit(this.state.selectedUser, this.state.selectedGameType)
  }

  playerPicker() {
    return(
      <select value={this.state.selectedUser} onChange={this.handleUserChange}>
        {this.state.users.map((user) => <option key={user.id} value={user.id}>{user.username}</option>)}
      </select>
    );
  }

  gamePicker() {
    return(
      <select value={this.state.selectedGameType} onChange={this.handleGameChange}>
        {this.state.gameTypes.map((gameType) => <option value={gameType}>{gameType}</option>)}
      </select>
    );
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>
          <h4>Challenge someone!</h4>
          {this.playerPicker()}
          {this.gamePicker()}
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ChallengeForm;