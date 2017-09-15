import React from 'react';
import ChallengeForm from "./challengeForm";
import Client from "./client";


class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games_data: this.props.games_data
		};
		this.renderGames = this.renderGames.bind(this);
		this.handlePlayClick = this.props.handlePlayClick.bind(this);
		this.updateGamesData = this.updateGamesData.bind(this);
		setInterval(()=> this.updateGamesData(), 5000);
	}
	onPlayClick(game_id, player_x) {
		this.handlePlayClick(game_id, player_x)
	}

	updateGamesData(){
		Client.games((games_data)=>{
			this.setState({games_data: games_data})
		})
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
				}, (game_data) => {
					this.setState((prevState) => {
						const games_data = prevState.games_data
						games_data.pending.push(game_data)
						return {
							games_data: games_data
						};
					});
				})
			}} />
			</div>
			</div>
			);
	}
}

export default Dashboard;