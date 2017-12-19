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
			Object.keys(this.state.gamesData).map((gameType) => this.renderGameLists(gameType, this.state.gamesData[gameType]))
		)
	}

	renderGameLists(gameType, games) {
		return(
			<div key={gameType}>
			<h2>{gameType}</h2>
			 {Object.keys(games).map((key) =>
   				<ul className={key} key={key}>
   				<h3>{key}</h3>
   					{this.renderGameList(games[key])}
   				</ul>
			)}
			 </div>
			 )
	}

	renderGameList(games) {
		return(
			games.map(game =>
				this.renderGame(game)
			)
		)
	}

	onSignOutClick() {
		Authentication.signout(() => this.setState({currentUser: null}))
	}

	renderGame(gameData) {
		let button
		let turn = [].concat.apply([], gameData.game.board).filter(space => space !== null).length % 2 === 0 ? gameData.game.challenged_id : gameData.game.challenger_id
		if(gameData.game.status !== "completed"){
			if (turn === this.state.currentUser.id) {
				button = <Link to={`/games/${gameData.game.type}/${gameData.game.id}`}>Play</Link>
			}else{
				button = <i>'s turn</i>
			}
		}else{
			button = <b>You {gameData.game.winner != null ? gameData.game.winner === this.state.currentUser.id ? "Won :)" : "Lost :(" : "tied :|"}</b>
		}
		return (
			<li key={gameData.game.id}>
			Game vs {gameData.opponent.username}
			{button}
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
