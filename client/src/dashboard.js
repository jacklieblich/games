import React from 'react';
import ChallengeForm from "./challengeForm";
import Client from "./client";
import App from "./cable";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gamesData: []
		};
		this.renderGames = this.renderGames.bind(this);
		this.handlePlayClick = this.props.handlePlayClick.bind(this);
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
			<div>
			<h2>{gameType}</h2>
			 {Object.keys(games).map((key) => 
   				<ul className={key}>
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

	renderGame(gameData) {
		let button
		let turn = [].concat.apply([], gameData.game.board).filter(space => space !== null).length % 2 === 0 ? gameData.game.challenged_id : gameData.game.challenger_id
		if(gameData.game.status !== "completed"){
			if (turn === this.props.currentUserId) {
				button = <button className="play-button" onClick={() => this.onPlayClick(gameData.game.id, gameData.game.challenged_id, gameData.game.type)}>
				Play
				</button>
			}else{
				button = <i>'s turn</i>
			}
		}else{
			button = <b>You {gameData.game.winner != null ? gameData.game.winner == this.props.currentUserId ? "Won :)" : "Lost :(" : "tied :|"}</b>
		}
		return (
			<li key={gameData.game.id}>
			Game vs {gameData.opponent.username}
			{button}
			</li>
		)
	}

	render() {
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
			</div>
		);
	}
}

export default Dashboard;