import React from 'react';
import Client from "../../../api";
import './styles.css';

class Column extends React.Component{

	renderColumn() {
		return(
			this.props.spaces.map((value, index) => this.renderSquare(value, index))
		);
	}

	renderSquare(user_id, index) {
		const classes = `space ${pieceFor(user_id, this.props.player1)}`;
		return (
			<div className={classes} key={index}>
			</div>
			);
	}

	onClick(i) {
		this.props.handleClick(i)
	}

	render() {
		return(
			<div className="board-row" onClick={() => this.onClick(this.props.columnNumber)}>
				{this.renderColumn()}
			</div>
			);
	}
}

class Connect4 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board: this.props.board,
			turn: this.props.turn,
			player1: this.props.player1
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps)
	}

	myTurn(){
		return this.state.turn === this.props.currentUserId
	}

	handleClick(i) {
		const board = this.state.board.slice();
		if (this.props.winner || !board[i].includes(null) || !this.myTurn()) {
			return;
		}
		const lowestOpenSpace = board[i].indexOf(null)
		board[i][lowestOpenSpace] = this.props.currentUserId;
		this.setState({
			board: board,
			turn: !this.state.turn
		});
		Client.updateBoard(this.props.gameId, i)
	}

	renderBoard() {
		let columns = []
		this.state.board.forEach((column, index) => {
			columns.push(<Column spaces={column} key={index} columnNumber = {index} handleClick = {this.handleClick} player1={this.state.player1}/>)
		}
		)
		return(
			columns
			);
	}

	render() {
		const winner = this.props.winner;
		let status;
		if (winner) {
			status = 'Winner: ' + pieceFor(winner, this.state.player1);
		} else {
			status = 'Next player: ' + pieceFor(this.state.turn, this.state.player1);
		}

		return (
			<div className="connect-4-board">
			<div className="status">{status}</div>
			<div className="board">
			{this.renderBoard()}
			</div>
			</div>
			);
	}
}

function pieceFor(user_id, player1) {
	let piece = "yellow"
	if(parseInt(user_id, 10) === player1){
		piece = "red"
	}else{
		if(user_id == null){
			piece = "empty"
		}
	}
	return(
		piece
	);
}

export default Connect4;
