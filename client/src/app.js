import React from 'react';
import LoginForm from "./loginForm";
import SignupForm from "./signupForm"
import Game from "./game";
import Client from "./client";
import Dashboard from "./dashboard";
import './index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user_id: false,
			game_id: false,
			player_x: false,
			has_account: false,
			loading: true
		};
		Client.getCurrentUser()
		.then((current_user)=>{
			this.setState({current_user_id: current_user.id, loading: false})
		})
		.catch(()=>{
			this.setState({loading: false})
		})
	}

	render() {
		let content
		if(this.state.loading){
			return <p>loading</p>
		}
		if (!this.state.current_user_id){
			if(this.state.has_account){
				content = <LoginForm handleSubmit={ (login_params) => {
					Client.login(login_params, (user) => {
						this.setState({current_user_id: user.id})
					})
				}} handleSignupClick={ ()=>this.setState({has_account: false})}/>
			}else{
				content = <SignupForm handleSubmit={ (user_params) => {
					Client.signup(user_params, (user) => {
						this.setState({current_user_id: user.id})
					})
				}} handleLoginClick={ ()=>this.setState({has_account: true})}/>
			}
		}else{
			if(!!this.state.game_id){
				content = <Game game_id={this.state.game_id} current_user_id={this.state.current_user_id} player_x={this.state.player_x} handleBackClick={()=>{
					this.setState({game_id: false})
				}}/>
			}else{
				content = <Dashboard games_data={this.state.games_data} current_user_id={this.state.current_user_id} handlePlayClick={(game_id, player_x) =>{
					this.setState({game_id: game_id, player_x: player_x})
				}}/>
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