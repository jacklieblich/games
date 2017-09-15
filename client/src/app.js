import React from 'react';
import LoginForm from "./loginForm";
import Game from "./game";
import Client from "./client";
import Dashboard from "./dashboard";
import './index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games_data: false,
			current_user_id: false,
			game_id: false,
			player_x: false
		};
	}

	render() {
		let content
		if (!this.state.current_user_id){
			content = <LoginForm handleSubmit={ (username, password) => {
				Client.login({username, password}, (user_id) => {
					this.setState({current_user_id: user_id})
				})
			}}/>
		}else{
			if(!!this.state.game_id){
				content = <Game game_id={this.state.game_id} current_user_id={this.state.current_user_id} player_x={this.state.player_x} handleBackClick={()=>{
					this.setState({game_id: false})
				}}/>
			}else{
				if(!this.state.games_data){
					Client.games((games_data) =>{
						this.setState({games_data: games_data})
					})
				}else{
					content = <Dashboard games_data={this.state.games_data} current_user_id={this.state.current_user_id} handlePlayClick={(game_id, player_x) =>{
						this.setState({game_id: game_id, player_x: player_x})
					}}/>
				}
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