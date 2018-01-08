import React from "react";
import Client from "../../api";
import { Link, Redirect } from 'react-router-dom';
import { Flash } from '../flash';
import { Spinner } from '../Spinner';

class UserPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedGameType: props.match.params.gameType,
      loading: true,
      newGameId: false
    };
    this.playerPicker = this.playerPicker.bind(this);
    this.getOtherUsers();
  }


  getOtherUsers() {
    Client.otherUsers((users) =>{
      this.setState({users: users, loading: false})
    })
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

    return (
          <div className="challenge-form">
          {this.playerPicker()}
          <Link to="/" className="btn back-button">Back</Link>
          </div>
    );
  }
}

export default UserPicker;
