import React from "react";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = props.handleSubmit;
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event){
    event.preventDefault();
    this.handleSubmit(this.state.username, this.state.password);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
      <h1>Signup or login</h1>
      <label>
      username:
      <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
      </label>
      <label>
      password:
      <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
      </form>
      );
  }
}

export default LoginForm;