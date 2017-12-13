import React from 'react';
import './index.css';
import Client from "./client";

class Column extends React.Component{
	constructor(props){
		super(props);
	}

	renderColumn() {
		return(
			this.props.spaces.map((value) => this.renderSquare(value))
		);
	}

	renderSquare(user_id) {
		const classes = `space ${pieceFor(user_id, this.props.player1)}`;
		return (
			<div className={classes}>
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

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(7).fill(Array()),
			turn: "",
			player1: ""
		};
		this.fillBoard = this.fillBoard.bind(this);
		this.fillBoard();
		this.handleClick = this.handleClick.bind(this);
		Client.subscribe({channel: 'GameChannel', game_id: this.props.gameId}, (gameData) => this.setState({squares: gameData.squares, turn: gameData.turn}));
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
		if (calculateWinner(squares) || !squares[i].includes(null) || !this.myTurn()) {
			return;
		}
		const lowestOpenSpace = squares[i].indexOf(null)
		squares[i][lowestOpenSpace] = this.props.currentUserId;
		this.setState({
			squares: squares,
			turn: !this.state.turn
		});
		Client.updateBoard(this.props.gameId, i)
	}

	renderBoard() {
		let columns = []
		this.state.squares.forEach((column, index) => {
			columns.push(<Column spaces={column} columnNumber = {index} handleClick = {this.handleClick} player1={this.state.player1}/>)
		}
		)
		return(
			columns
			);
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + pieceFor(winner, this.state.player1);
		} else {
			status = 'Next player: ' + pieceFor(this.state.turn, this.state.player1);
		}

		return (
			<div className="connect-4">
			<div className="status">{status}</div>
			<div className="board">
			{this.renderBoard()}
			</div>
			</div>
			);
	}
}

class Connect4 extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Board gameId={this.props.gameId} currentUserId={this.props.currentUserId}/>
			);
	}
}

function pieceFor(user_id, player1) {
	let piece = "yellow"
	if(user_id == player1){
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

function calculateWinner(squares) {
	//rows
	for(let col = 0; col < 4; col++){
		for(let row = 0; row < 6; row++){
			if(squares[col][row] && squares[col][row] === squares[col+1][row] && squares[col][row] === squares[col+2][row] && squares[col][row] === squares[col+3][row]){
				console.log("winner");
				return squares[col][row];
			}
		}
	}
	//cols
	for(let col = 0; col < 7; col++){
		for(let row = 0; row < 3; row++){
			if(squares[col][row] && squares[col][row] === squares[col][row+1] && squares[col][row] === squares[col][row+2] && squares[col][row] === squares[col][row+3]){
				console.log("winner");
				return squares[col][row];
			}
		}
	}
	for (let col = 0; col < 4; col++){
		for(let row = 0; row < 3; row++){
			if(squares[col][row] && squares[col][row] === squares[col+1][row+1] && squares[col][row] === squares[col+2][row+2] && squares[col][row] === squares[col+3][row+3]){
				console.log("winner");
				return squares[col][row];
			}
		}
	}

	for (let col = 0; col < 4; col++){
		for(let row = 3; row < 6; row++){
			if(squares[col][row] && squares[col][row] === squares[col+1][row-1] && squares[col][row] === squares[col+2][row-2] && squares[col][row] === squares[col+3][row-3]){
				console.log("winner");
				return squares[col][row];
			}
		}
	}

	return null
}
export default Connect4;