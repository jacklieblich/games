import React from 'react';
import './index.css';
import TicTacToe from "./TicTacToe";

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
	}
	renderGame() {
		let game
		switch(this.props.gameType) {
			case "TicTacToe":
				game = <TicTacToe gameId={this.props.gameId} currentUserId={this.props.currentUserId} playerX={this.props.playerX}/>;
				break
		}
		return game
	}
	render() {
		return (
			<div className="game">
			<div className="game-board">
			{this.renderGame()}
			</div>
			<button className="back-button" onClick={() => this.props.handleBackClick()}>Back</button>
			</div>
			);
	}
}

export default GameRouter;