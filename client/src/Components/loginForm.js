import React from "react";
import facebook from "./images/facebook.png"
import { Link, Redirect } from 'react-router-dom'
import { Authentication } from '../Authentication';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirectToReferrer: false,
      error: "",
      facebook: true
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
    const { referrer } = this.props.location.state || { referrer: { pathname: '/' } }
    const redirectToReferrer = this.state.redirectToReferrer

    if (redirectToReferrer === true) {
      return <Redirect to={referrer} />
    }

    if (this.state.facebook){
      return(
        <div>
        <img className="facebook" src={facebook} onClick={() => {
          window.location = process.env.REACT_APP_API_URL + "/users/auth/facebook?origin=" + encodeURIComponent(window.location.origin+ "/#" + referrer.pathname)
        }}/>
        <p className="no-facebook" onClick={() => this.setState({facebook: false})}>I'd rather not.</p>
        </div>
      )
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
          <div className="facebook-login" onClick={() => {
          window.location = process.env.REACT_APP_API_URL + "/users/auth/facebook?origin=" + encodeURIComponent(window.location.origin+ "/#" + referrer.pathname)
        }}></div>
        </form>
        <Link to={{
          pathname: '/signup',
          state: { referrer: referrer }
        }}>
          create account
        </Link>
      </div>
      );
  }
}

export default LoginForm;
