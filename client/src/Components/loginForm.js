import React from "react";
import { Link, Redirect } from 'react-router-dom'
import { Authentication } from '../Authentication';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirectToReferrer: false,
      error: ""
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

  onSubmit(event){
    event.preventDefault();
    Authentication.login(
      {user: {password: this.state.password, email: this.state.email}},
      () => this.setState({redirectToReferrer: true}),
      (error) => error.response.json().then((response) => this.setState({error: response.error}))
    )
  }

  render() {
    const redirectToReferrer = this.state.redirectToReferrer

    if (redirectToReferrer === true) {
      return <Redirect to='/' />
    }

    return (
      <div className="form-container">
        <form onSubmit={this.onSubmit.bind(this)}>
          <h1>Login</h1>
          <p className="error">{this.state.error}</p>
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
        <Link to='/signup'>create account</Link>
      </div>
      );
  }
}

export default LoginForm;
