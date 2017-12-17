import React from 'react';
import LoginForm from "./loginForm";
import SignupForm from "./signupForm"
import Game from "./Game";
import Dashboard from "./dashboard";
import { Switch, Route, Redirect } from 'react-router-dom';
import { Authentication } from '../Authentication';
import '../index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
		Authentication.getCurrentUser(() => this.setState({loading: false}))
	}

	render() {

		if (this.state.loading) {
			return <p>loading</p>
		}

		return (
			<div className="app">
				<Switch>
  					<Route path='/signup' component={SignupForm}/>
  					<Route path='/login' component={LoginForm}/>
  					<Route path='/games/:gameType/:gameId' component={Game}/>
  					<PrivateRoute component={Dashboard} currentUserId={this.state.currentUserId}/>
				</Switch>
			</div>
		);
	}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Authentication.currentUser !== null
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)


export default App;
