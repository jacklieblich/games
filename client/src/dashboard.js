import React from 'react';
import ChallengeForm from "./challengeForm";
import Client from "./client";
import App from "./cable";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gamesData: {pending: [], active: [], completed: []}
		};
		this.renderGames = this.renderGames.bind(this);
		this.handlePlayClick = this.props.handlePlayClick.bind(this);
		this.loadGames = this.loadGames.bind(this);
		this.loadGames();
		this.subscribe = this.subscribe.bind(this);
		this.subscribe();
	}

	loadGames(){
		Client.games((gamesData) =>{
			this.setState({gamesData: gamesData})
		})
	}

	subscribe(){
		App.cable.subscriptions.create('GamesChannel',{
			connected: function() { console.log("cable: connected") },
			disconnected: function() { console.log("cable: disconnected") }, 
			received: function(gamesData) {
				this.setState({gamesData: gamesData})
			}.bind(this)
		}
		)
	}
	onPlayClick(gameId, playerX) {
		this.handlePlayClick(gameId, playerX)
	}

	renderGames(games) {
		return (
			games.map(function(gameData) {
				let button
				let turn = gameData.game.board.filter(space => space !== null).length % 2 === 0 ? gameData.game.challenged_id : gameData.game.challenger_id
				if(gameData.game.status !== "completed"){
					if (turn === this.props.currentUserId) {
						button = <button className="play-button" onClick={() => this.onPlayClick(gameData.game.id, gameData.game.challenged_id)}>
						Play
						</button>
					}else{
						button = <i>'s turn</i>
					}
				}else{
					button = <b>You {gameData.game.winner === this.props.currentUserId ? "Won :)" : "Lost :("}</b>
				}
				return (
					<li key={gameData.game.id}>
					Game vs {gameData.opponent.username}
					{button}
					</li>
					)
			}, this)
			)
	}
	render() {
		return (
			<div className="dashboard">
				<h1>Games</h1>
				<div>
					<ChallengeForm
						handleSubmit={(challenged_id) => {
							Client.challenge({challenged_id: challenged_id})
						}} 
					/>
				</div>
				<ul className="pending">
					<b>Pending</b>
					{this.renderGames(this.state.gamesData.pending)}
				</ul>
				<ul className="active">
					<b>Active</b>
					{this.renderGames(this.state.gamesData.active)}
				</ul>
				<ul className="completed">
					<b>Completed</b>
					{this.renderGames(this.state.gamesData.completed)}
				</ul>
			</div>
		);
	}
}

export default Dashboard;