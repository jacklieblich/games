import React from "react";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = props.handleSubmit;
    this.handleSignupClick = props.handleSignupClick;
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
    this.handleSubmit({user: {password: this.state.password, email: this.state.email}});
  }

  onSignupClick(event){
    event.preventDefault();
    this.handleSignupClick();
  }

  render() {
    return (
      <div className="form-container">
      <form onSubmit={this.onSubmit.bind(this)}>
      <h1>Login</h1>
      <label>
      email:
      <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
      </label>
      <label>
      password:
      <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
      </form>
      <a href="" onClick={this.onSignupClick.bind(this)}>create account</a>
      </div>
      );
  }
}

export default LoginForm;