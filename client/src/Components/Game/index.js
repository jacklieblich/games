import React from 'react';
import TicTacToe from "../Games/TicTacToe";
import Connect4 from "../Games/Connect4";
import Hex from "../Games/Hex";
import { Authentication } from '../../Authentication';
import { Link } from 'react-router-dom';
import Client from "../../api";
import './styles.css';

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opponentWatching: false,
			board: [],
			turn: "",
			player1 : "",
			winner: false,
			gameId: this.props.match.params.gameId,
			opponentId: "",
			lastMove: "",
			nudgable: true
		}
		this.fillBoard = this.fillBoard.bind(this);
		//this.nudge = this.nudge.bind(this);
		this.fillBoard();
	}

	componentDidMount() {
		this.subscription = Client.subscribe({channel: 'GameChannel', game_id: this.state.gameId},
			(gameData) => {
				if ('stoppedWatching' in gameData || 'isWatching' in gameData){
					this.handleOpponentWatching(gameData);
				}else{
					const newBoard = [].concat.apply([], gameData.board);
					const oldBoard = [].concat.apply([], this.state.board);
					for(let i = 0; i < oldBoard.length; i++){
						if (newBoard[i] !== oldBoard[i]){
							this.setState({lastMove: i})
						}
					}
					this.setState(gameData)
				}
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

	handleOpponentWatching(gameData) {
		if (gameData.stoppedWatching === this.state.opponentId){
			this.setState({opponentWatching: false})
		}
		//cant hide watching status by closing secondary connection
		if (gameData.stoppedWatching === Authentication.currentUser.id){
			Client.imWatching({game_id: this.state.gameId})
		}
		if (gameData.isWatching === this.state.opponentId && !this.state.opponentWatching){
			this.setState({opponentWatching: true})
			Client.imWatching({game_id: this.state.gameId})
		}
	}

	renderGame() {
		const gameId = this.state.gameId
		const gameType = this.props.match.params.gameType
		const currentUserId = Authentication.currentUser.id
		let game

		switch(gameType) {
			case "TicTacToe":
				game = <TicTacToe gameId={gameId} currentUserId={currentUserId} board={this.state.board} turn={this.state.turn} player1={this.state.player1} winner={this.state.winner} lastMove={this.state.lastMove}/>;
				break;
			case "Connect4":
				game = <Connect4 gameId={gameId} currentUserId={currentUserId} board={this.state.board} turn={this.state.turn} player1={this.state.player1} winner={this.state.winner} lastMove={this.state.lastMove}/>;
				break;
			case "Hex":
				game = <Hex gameId={gameId} currentUserId={currentUserId} board={this.state.board} turn={this.state.turn} player1={this.state.player1} winner={this.state.winner} lastMove={this.state.lastMove}/>;
				break;
			default:
				throw new Error(gameType + " is not a game type");
		}
		return game

	}

	renderOpponentWatching() {
		return(
			<div className="blue-dot">
				<div className="double-bounce1"></div>
				<div className="double-bounce2"></div>
			</div>
		);
	}

	renderNudge() {
		if(!this.myTurn() && this.state.nudgable && !this.state.winner && !this.state.opponentWatching){
			return <button className="nudge" onClick={() => {
				Client.nudge(this.state.opponentId, this.state.gameId)
				this.setState({nudgable: false})
			}}>( •_•)σ</button>
		}
	}

	myTurn(){
		console.log(this.state.turn)
		console.log(Authentication.currentUser.id)
		console.log(this.state.turn === Authentication.currentUser.id)
		return this.state.turn === Authentication.currentUser.id
	}

	render() {
		const winner = this.state.winner;
		let status;
		if (winner) {
			status = this.state.winner === Authentication.currentUser.id ? "You Won! Congrats!" : "You Lost. Bummer."
		} else {
			status = this.state.turn === Authentication.currentUser.id ? "Your Turn" : "Opponent's Turn"
		}
		return (
			<div className="game">
				<div className="status"><p>{status}</p></div>
				<div className="game-board">
					{this.renderGame()}
				</div>
				<div className="bottom-game-section">
					{this.state.opponentWatching && this.renderOpponentWatching()}
					{this.renderNudge()}
					<Link to='/' className="back-button">Back</Link>
				</div>
			</div>
			);
	}
}

export default GameRouter;
