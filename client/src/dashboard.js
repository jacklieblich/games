import React from 'react';
import ChallengeForm from "./challengeForm";
import Client from "./client";
import App from "./cable";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games_data: {pending: [], active: [], completed: []}
		};
		this.renderGames = this.renderGames.bind(this);
		this.handlePlayClick = this.props.handlePlayClick.bind(this);
		this.loadGames = this.loadGames.bind(this);
		this.loadGames();
		this.subscribe = this.subscribe.bind(this);
		this.subscribe();
	}

	loadGames(){
		Client.games((games_data) =>{
			this.setState({games_data: games_data})
		})
	}

	subscribe(){
		App.cable.subscriptions.create('GamesChannel',{
			connected: function() { console.log("cable: connected") },
			disconnected: function() { console.log("cable: disconnected") }, 
			received: function(games_data) {
				this.setState({games_data: games_data})
			}.bind(this)
		}
		)
	}
	onPlayClick(game_id, player_x) {
		this.handlePlayClick(game_id, player_x)
	}

	renderGames(games) {
		return (
			games.map(function(game_data) {
				let button
				let turn = game_data.game.board.filter(space => space !== null).length % 2 === 0 ? game_data.game.challenged_id : game_data.game.challenger_id
				if(game_data.game.status !== "completed"){
					if (turn === this.props.current_user_id) {
						button = <button onClick={() => this.onPlayClick(game_data.game.id, game_data.game.challenged_id)}>
						Play
						</button>
					}else{
						button = <i> waiting for opponent</i>
					}
				}else{
					button = <b>You {game_data.game.winner === this.props.current_user_id ? "Won :)" : "Lost :("}</b>
				}
				return (
					<li key={game_data.game.id}>
					{game_data.opponent.username}
					{button}
					</li>
					)
			}, this)
			)
	}
	render() {
		return (
			<div>
			<ul className="pending">
			<b>Pending</b>
			{this.renderGames(this.state.games_data.pending)}
			</ul>
			<ul className="active">
			<b>Active</b>
			{this.renderGames(this.state.games_data.active)}
			</ul>
			<ul className="completed">
			<b>Completed</b>
			{this.renderGames(this.state.games_data.completed)}
			</ul>
			<div>
			<ChallengeForm handleSubmit={(challenged_id) => {
				Client.challenge({
					challenged_id: challenged_id
				})
			}} />
			</div>
			</div>
			);
	}
}

export default Dashboard;