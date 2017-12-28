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
		
		return(
			<div key={gameType} className={gameType}>
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
		let result
		let turn = ""
		let classes = ""
		if (gameData.game.status !== "completed") {
			classes += this.state.currentUser.id === gameData.turn ? "your-turn" : "opponent-turn"
			text = gameData.opponent.username
			turn = this.state.currentUser.id === gameData.turn ? "Go!" : "waiting..."
		}else {
			if (gameData.game.winner != null) {
				result = gameData.game.winner === this.state.currentUser.id ? "winner" : "loser" 
			}else {
				result = "tie"
			}
			let resultDisplay
			switch(result) {
				case "winner":
					resultDisplay = String.fromCodePoint(55356, 57286)
					break;
				case "loser":
					resultDisplay = String.fromCodePoint(55358, 56614)
					break;
				case "tie":
					resultDisplay = String.fromCodePoint(55357, 56404)
					break;
			}
			classes += result
			turn = resultDisplay
			text = gameData.opponent.username
		}
		return (
			<li key={gameData.game.id} className={classes}>
				<Link to={`/games/${gameData.game.type}/${gameData.game.id}`}>
					<p className="turn">{turn}</p>
					<p className="game-text">{text}</p>
					<div className={"game-logo " + gameData.game.type}></div>
					<p className="time-ago">{gameData.time_ago} ago</p>
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
				  <div className="rect1"></div>
				  <div className="rect2"></div>
				  <div className="rect3"></div>
				  <div className="rect4"></div>
				  <div className="rect5"></div>
				</div>
   			)
   		}

		return (
			<div className="dashboard">
				{this.renderFlashErrors()}
				<aside className="dashboard-header">
					{this.renderRecord()}
					<div className="challenge-button">
						<Link to="/challenge">+</Link>
					</div>
				</aside>
				<div>
				{this.renderGames()}
				</div>
				<button className="signout" onClick={this.onSignOutClick}>Sign Out</button>
			</div>
		);
	}
}

export default Dashboard;
