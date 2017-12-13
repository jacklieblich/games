import React from 'react';
import './index.css';
import TicTacToe from "./TicTacToe";
import Connect4 from "./Connect4";
import { Authentication } from './Authentication';
import { Link } from 'react-router-dom';

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
	}

	renderGame() {
		const gameId = this.props.match.params.gameId
		const gameType = this.props.match.params.gameType
		const currentUserId = Authentication.currentUser.id
		let game

		switch(gameType) {
			case "TicTacToe":
				game = <TicTacToe gameId={gameId} currentUserId={currentUserId}/>;
				break;
			case "Connect4":
				game = <Connect4 gameId={gameId} currentUserId={currentUserId}/>;
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
				<Link to='/' className="back-button">Back</Link>
			</div>
			);
	}
}

export default GameRouter;