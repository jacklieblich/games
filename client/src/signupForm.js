import React from "react";
import { Link, Redirect } from 'react-router-dom'
import { Authentication } from './Authentication';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      redirectToReferrer: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    Authentication.signup(
      {user: {username: this.state.username, password: this.state.password, email: this.state.email}},
      () => this.setState({redirectToReferrer: true})
    );
  }

  render() {
    const redirectToReferrer = this.state.redirectToReferrer

    if (redirectToReferrer === true) {
      return <Redirect to='/' />
    }

    return (
    	<div className="form-container">
        <form onSubmit={this.onSubmit.bind(this)}>
          <h1>Signup</h1>
          <label>
            username:
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
          </label>
          <label>
            email:
            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
          </label>
          <label>
            password:
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        already have an account?<Link to='/login'>login</Link>
      </div>
      );
  }
}

export default SignupForm;