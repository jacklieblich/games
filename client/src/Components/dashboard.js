import React from 'react';
import Client from "../api";
import { Authentication } from "../Authentication";
import { Redirect, Link } from 'react-router-dom';
import { Flash } from './flash';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: Authentication.currentUser,
			gamesData: [],
			loading: true
		};
		this.onSignOutClick = this.onSignOutClick.bind(this);
		this.renderGames = this.renderGames.bind(this);
		this.loadGames = this.loadGames.bind(this);
	}

	componentDidMount() {
		this.loadGames();
		this.subscription = Client.subscribe({channel: 'GamesChannel'}, (gamesData) => this.setState({gamesData: gamesData}));
	}

	componentWillUnmount() {
		Client.endSubscription(this.subscription)
	}

	loadGames(){
		Client.games((gamesData) => this.setState({gamesData: gamesData, loading: false}))
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
		const withSpaces = gameType.replace( /([A-Z])/g, " $1" );
		const capitalized = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
		
		return(
			<div key={gameType}>
			<h2>{capitalized}</h2>
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
		let turn = ""
		if (gameData.game.status !== "completed") {
			text = gameData.opponent.username
			turn = this.state.currentUser.id === gameData.turn ? "Go!" : "waiting..."
		}else {
			let result
			if (gameData.game.winner != null) {
				result = gameData.game.winner === this.state.currentUser.id ? String.fromCodePoint(55356, 57286) : String.fromCodePoint(55358, 56614)
			}else {
				result = String.fromCodePoint(55357, 56404)
			}
			text = result + " " + gameData.opponent.username
		}
		return (
			<li key={gameData.game.id}>
				<Link to={`/games/${gameData.game.type}/${gameData.game.id}`}>
					<span className={"game-logo " + gameData.game.type}></span>
					<span className="game-text">{text}<span className="time-ago">{gameData.time_ago} ago</span></span>
					<span className="turn">{turn}</span>
				</Link>
			</li>
		)
	}

	renderRecord() {
		if (Object.keys(this.state.gamesData).length > 0) {
			const wins = this.state.gamesData.completedGames.filter(gameData => gameData.game.winner === this.state.currentUser.id).length
			const losses = this.state.gamesData.completedGames.filter(gameData => gameData.game.winner !== this.state.currentUser.id && gameData.game.winner !== null).length
			const ties = this.state.gamesData.completedGames.filter(gameData => gameData.game.winner === null).length
			return(
				<div className="record">
					<h4>Record</h4>
					<p>{wins} - {losses} - {ties}</p>
				</div>
				)
		}
	}

	renderFlashErrors() {
		const errors = Flash.renderErrors()
		if (errors !== null) {
			return <div className="flash">{errors}</div>
		}
		
	}

	render() {

    	if (this.state.currentUser === null) {
    		return <Redirect to='/login' />
   		}

   		if (this.state.loading) {
   			return(
   				<div className="spinner">
				  <div className="double-bounce1"></div>
				  <div className="double-bounce2"></div>
				</div>
   			)
   		}

		return (
			<div className="dashboard">
				{this.renderFlashErrors()}
				<div className="dashboard-header">
					<div className="challenge-button">
						<Link to="/challenge">Play!</Link>
					</div>
					{this.renderRecord()}
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
