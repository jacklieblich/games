import React from 'react';
import './index.css';
import Client from "./client";
import App from "./cable";

function Square(props) {
	const classes = `square ${props.value}`;
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
			xIsNext: true,
		};
		this.fillBoard = this.fillBoard.bind(this);
		this.fillBoard()
		this.subscribe = this.subscribe.bind(this);
		this.subscribe();
	}

	subscribe(){
		App.cable.subscriptions.create({channel: 'GameChannel',game_id: this.props.game_id},{
			connected: function() { console.log("cable: connected") },
			disconnected: function() { console.log("cable: disconnected") }, 
			received: function(game_data) {
				this.setState(game_data)
			}.bind(this)
		}
		)
	}


	myTurn() {
		const player_x = this.props.player_x === this.props.current_user_id ? true : false
		return player_x === this.state.xIsNext
	}

	fillBoard() {
		Client.loadGame(this.props.game_id, (board) => {
			this.setState({
				squares: board,
				xIsNext: board.filter(space => space !== null).length % 2 === 0
			})
		})
	}

	handleClick(i) {
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i] || !this.myTurn()) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			squares: squares,
			xIsNext: !this.state.xIsNext
		});
		Client.updateBoard(this.props.game_id, squares[i], i)
	}

	renderSquare(i) {
		return (
			<Square
			value={this.state.squares[i]}
			onClick={() => this.handleClick(i)}
			/>
			);
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div>
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

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game_id: this.props.game_id
		}
	}
	render() {
		return (
			<div className="game">
			<div className="game-board">
			<Board game_id={this.state.game_id} current_user_id={this.props.current_user_id} player_x={this.props.player_x}/>
			</div>
			<button className="back-button" onClick={() => this.props.handleBackClick()}>Back</button>
			</div>
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
export default Game;