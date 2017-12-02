import React from 'react';
import LoginForm from "./loginForm";
import SignupForm from "./signupForm"
import GameRouter from "./GameRouter";
import Client from "./client";
import Dashboard from "./dashboard";
import './index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user_id: false,
			gameId: false,
			player_x: false,
			has_account: false,
			loading: true,
			signup_error: false,
			login_error: false
		};
		this.login = this.login.bind(this)
		this.signup = this.signup.bind(this)
		this.getCurrentUser()
	}

	getCurrentUser() {
		Client.getCurrentUser()
		.then((current_user)=>{
			this.setState({current_user_id: current_user.id, loading: false})
		})
		.catch(()=>{
			this.setState({loading: false})
		})
	}

	login(login_params) {
		Client.login(login_params, (user) => {
			this.setState({current_user_id: user.id})
		}).catch(function() {
			this.setState({login_error: true})
		}.bind(this)
		)
	}

	signup(user_params) {
		Client.signup(user_params, (user) => {
			this.setState({current_user_id: user.id})
		}).catch(function() {
			this.setState({signup_error: true})
		}.bind(this)
		)
	}

	render() {
		let content
		
		if (this.state.loading) {
			return <p>loading</p>
		}

		if (!this.state.current_user_id) {
			if (this.state.has_account) {
				content = 
				<LoginForm 
					handleSubmit={this.login} 
					handleSignupClick={ ()=> {
						this.setState({has_account: false})
					}} 
					login_error={this.state.login_error}
				/>
			} else {
				content =
				<SignupForm
					handleSubmit={this.signup}
					handleLoginClick={ ()=>this.setState({has_account: true})}
					signup_error={this.state.signup_error}
				/>
			}
		} else {
			if (!!this.state.gameId) {
				content =
				<GameRouter
					gameType={this.state.gameType}
					gameId={this.state.gameId}
					currentUserId={this.state.current_user_id}
					playerX={this.state.player_x}
					handleBackClick={()=>{
						this.setState({gameId: false})
					}}
				/>
			} else {
				content =
				<Dashboard
					gamesData={this.state.games_data}
					currentUserId={this.state.current_user_id}
					handlePlayClick={(gameId, player_x, gameType) =>{
						this.setState({gameId: gameId, player_x: player_x, gameType: gameType})
					}}
				/>
			}
		}

		return (
			<div className="app">
			{content}
			</div>
			);
	}
}


export default App;