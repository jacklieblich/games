import React from 'react';
import './index.css';
import Client from "./client";

function Square(props) {
	const classes = `space ${props.value}`;
	return (
		<button className={classes} onClick={props.onClick}>
		{props.value}
		</button>
		);
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			turn: ""
		};
		this.fillBoard = this.fillBoard.bind(this);
		this.fillBoard();
		Client.subscribe({channel: 'GameChannel', game_id: this.props.gameId}, (gameData) => this.setState(gameData));
	}

	fillBoard() {
		Client.loadGame(this.props.gameId, (game_data) => {
			this.setState(game_data)
		})
	}

	myTurn(){
		return this.state.turn === this.props.currentUserId
	}

	handleClick(i) {
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i] || !this.myTurn()) {
			return;
		}
		squares[i] = this.props.currentUserId;
		this.setState({
			squares: squares,
			turn: !this.state.turn
		});
		Client.updateBoard(this.props.gameId, i)
	}

	pieceFor(userId) {
		let piece = null;
		if (userId != null){
			piece = this.props.playerX == userId ? 'X' : 'O'
		}
		return piece; 
	}

	renderSquare(i) {
		return (
			<Square
			value={this.pieceFor(this.state.squares[i])}
			onClick={() => this.handleClick(i)}
			/>
			);
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + this.pieceFor(winner);
		} else {
			status = 'Next player: ' + this.pieceFor(this.state.turn);
		}

		return (
			<div className="tic-tac-toe">
			<div className="status">{status}</div>
			<div className="board-row">
			{this.renderSquare(0)}
			{this.renderSquare(1)}
			{this.renderSquare(2)}
			</div>
			<div className="board-row">
			{this.renderSquare(3)}
			{this.renderSquare(4)}
			{this.renderSquare(5)}
			</div>
			<div className="board-row">
			{this.renderSquare(6)}
			{this.renderSquare(7)}
			{this.renderSquare(8)}
			</div>
			</div>
			);
	}
}

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Board gameId={this.props.gameId} currentUserId={this.props.currentUserId} playerX={this.props.player1}/>
			);
	}
}

function calculateWinner(squares) {
	const lines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
export default TicTacToe;