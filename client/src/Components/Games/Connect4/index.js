import React from 'react';
import Client from "../../../api";
import './styles.css';

class Column extends React.Component{

	renderColumn() {
		return(
			this.props.spaces.map((value, index) => this.renderSquare(value, index))
		);
	}

	renderSquare(userId, index) {
		const lastMove = this.props.lastMove !== "" && (this.props.lastMove - this.props.columnNumber*6) === index ? "last-move" : ""
		const classes = `space ${lastMove}`;
		return (
			<div className={classes} key={index} style={{backgroundColor: this.pieceFor(userId)}}>
			</div>
			);
	}

	onClick(i) {
		this.props.handleClick(i)
	}

	pieceFor(userId) {
		let piece = this.props.player2Piece
		if(parseInt(userId, 10) === this.props.player1){
			piece = this.props.player1Piece
		}else{
			if(userId === null){
				piece = "empty"
			}
		}
		return(
			piece
		);
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
			columns.push(
				<Column 
					spaces={column}
					key={index}
					columnNumber = {index}
					handleClick = {this.handleClick}
					player1={this.state.player1}
					lastMove={this.myTurn() ? this.props.lastMove : ""}
					player1Piece={this.props.player1Piece}
					player2Piece={this.props.player2Piece}
				/>
			)
		}
		)
		return(
			columns
			);
	}

	render() {
		return (
			<div className="connect-4-board">
			<div className="board">
			{this.renderBoard()}
			</div>
			</div>
			);
	}
}

export default Connect4;
