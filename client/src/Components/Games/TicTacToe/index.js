import React from 'react';
import Client from "../../../api";
import './styles.css';

function Square(props) {
	const classes = `space ${props.value}`;
	return (
		<button className={classes} onClick={props.onClick}>
		</button>
		);
}

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board: props.board,
			turn: props.turn,
			player1: props.player1
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps)
	}

	myTurn(){
		return this.state.turn === this.props.currentUserId
	}

	handleClick(i) {
		const board = this.state.board.slice();
		if (this.props.winner || board[i] || !this.myTurn()) {
			return;
		}
		board[i] = this.props.currentUserId;
		this.setState({
			board: board,
			turn: !this.state.turn
		});
		Client.updateBoard(this.props.gameId, i)
	}

	pieceFor(userId) {
		let piece = null;
		const playerX = this.state.player1
		if (userId != null){
			piece = playerX == userId ? 'X' : 'O'
		}
		return piece;
	}

	renderSquare(i) {
		return (
			<Square
			value={this.pieceFor(this.state.board[i])}
			onClick={() => this.handleClick(i)}
			/>
			);
	}

	render() {
		const winner = this.props.winner;
		let status;
		if (winner) {
			status = 'Winner: ' + this.pieceFor(winner);
		} else {
			status = 'Next player: ' + this.pieceFor(this.state.turn);
		}

		return (
			<div className="tic-tac-toe-board">
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

export default TicTacToe;
