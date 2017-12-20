import React from 'react';
import ChallengeForm from "./challengeForm";
import Client from "../api";
import { Authentication } from "../Authentication";
import { Redirect, Link } from 'react-router-dom';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: Authentication.currentUser,
			gamesData: []
		};
		this.onSignOutClick = this.onSignOutClick.bind(this);
		this.renderGames = this.renderGames.bind(this);
		this.loadGames = this.loadGames.bind(this);
		this.loadGames();
	}

	componentDidMount() {
		this.subscription = Client.subscribe({channel: 'GamesChannel'}, (gamesData) => this.setState({gamesData: gamesData}));
	}

	componentWillUnmount() {
		Client.endSubscription(this.subscription)
	}

	loadGames(){
		Client.games((gamesData) => {
			this.setState({gamesData: gamesData})
		})
	}

	onPlayClick(gameId, playerX, gameType) {
		this.handlePlayClick(gameId, playerX, gameType)
	}

	renderGames() {
		return (
			Object.keys(this.state.gamesData).map((gameType) => this.renderGameList(gameType, this.state.gamesData[gameType]))
		)
	}

	renderGameList(gameType, games) {
		return(
			<div key={gameType}>
			<h2>{gameType}</h2>
			<ul>
			{games.map(game =>
				this.renderGame(game)
			)}
			</ul>
			</div>
		)
	}

	onSignOutClick() {
		Authentication.signout(() => this.setState({currentUser: null}))
	}

	renderGame(gameData) {
		let text
		if (gameData.game.status !== "completed") {
			text = gameData.opponent.username
		}else {
			let result
			if (gameData.game.winner != null) {
				result = gameData.game.winner === this.state.currentUser.id ? "Won :)" : "Lost :("
			}else {
				result = "tied :|"
			}
			text = "You " + result + " vs " + gameData.opponent.username
		}
		return (
			<li key={gameData.game.id}>
				<Link to={`/games/${gameData.game.type}/${gameData.game.id}`}>
					<span className={"game-logo " + gameData.game.type}></span><span className="game-text">{text}<span className="time-ago">{gameData.time_ago} ago</span></span>
				</Link>
			</li>
		)
	}

	render() {

    	if (this.state.currentUser === null) {
    		return <Redirect to='/login' />
   		}

		return (
			<div className="dashboard">
				<h1>Games</h1>
				<div>
					<ChallengeForm
						handleSubmit={(challenged_id, game_type) => {
							Client.challenge({challenged_id, game_type})
						}}
					/>
				</div>
				<div>
				{this.renderGames()}
				</div>
				<button onClick={this.onSignOutClick}>signout</button>
			</div>
		);
	}
}

export default Dashboard;
