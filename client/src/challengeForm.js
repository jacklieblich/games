import React from "react";
import Client from "./client";

class ChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = props.handleSubmit;
    Client.otherUsers((users) =>{
      this.setState({users: users})
      this.setState({value: users[0].id})
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    this.handleSubmit(this.state.value)
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
      <label>
      Select a player to challenge:
      <select value={this.state.value} onChange={this.handleChange}>

      {
        this.state.users.map(function(user){
          return <option key={user.id} value={user.id}>{user.username}</option>;
        })
      }
      </select>
      </label>
      <input type="submit" value="Submit" />
      </form>
      );
  }
}

export default ChallengeForm;