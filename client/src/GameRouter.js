import React from 'react';
import './index.css';
import TicTacToe from "./TicTacToe";
import Connect4 from "./Connect4";
import { Authentication } from './Authentication';
import { Link } from 'react-router-dom';
import Client from "./client";

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opponentWatching: false,
			board: [],
			turn: "",
			player1 : "",
			winner: false,
			gameId: this.props.match.params.gameId
		}
		this.fillBoard = this.fillBoard.bind(this);
		this.fillBoard();
	}

	componentDidMount() {
		this.subscription = Client.subscribe({channel: 'GameChannel', game_id: this.state.gameId}, 
			(gameData) => {
				if(gameData.opponentWatching == true && this.state.opponentWatching != true){
					Client.bothWatching({game_id: this.state.gameId})
				}
				this.setState(gameData)
			}
		)			
	}

	componentWillUnmount() {
		Client.endSubscription(this.subscription)
	}

	fillBoard() {
		Client.loadGame(this.state.gameId, (game_data) => {
			this.setState(game_data)
		})
	}

	renderGame() {
		const gameId = this.state.gameId
		const gameType = this.props.match.params.gameType
		const currentUserId = Authentication.currentUser.id
		let game

		switch(gameType) {
			case "TicTacToe":
				game = <TicTacToe gameId={gameId} currentUserId={currentUserId} board={this.state.board} turn={this.state.turn} player1={this.state.player1} winner={this.state.winner}/>;
				break;
			case "Connect4":
				game = <Connect4 gameId={gameId} currentUserId={currentUserId} board={this.state.board} turn={this.state.turn} player1={this.state.player1} winner={this.state.winner}/>;
				break;
		}
		return game

	}

	render() {
		return (
			<div className="game">
				<div className="game-board">
					{this.renderGame()}
				</div>
				<p>{this.state.opponentWatching ? "opponentWatching" : ""}</p>
				<Link to='/' className="back-button">Back</Link>
			</div>
			);
	}
}

export default GameRouter;