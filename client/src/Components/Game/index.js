import React from 'react';
import TicTacToe from "../Games/TicTacToe";
import Connect4 from "../Games/Connect4";
import Hex from "../Games/Hex";
import { Authentication } from '../../Authentication';
import { Link, Redirect } from 'react-router-dom';
import Client from "../../api";
import { Spinner } from '../Spinner';
import { Flash } from '../flash';
import './styles.css';

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = {
			opponentWatching: false,
			board: [],
			turn: "",
			player1 : "",
			winner: false,
			opponentId: "",
			lastMove: "",
			nudgable: true,
			loading: true,
			gameType: props.match.params.gameType,
			newGameId: false,
			player1Piece: "",
			player2Piece: ""
		}
		this.initialState.gameId = props.match.params.gameId
		this.state = this.initialState
		this.fillBoard = this.fillBoard.bind(this)
	}

	componentDidMount() {
		this.subscribe()
		this.fillBoard()
	}

	componentWillUnmount() {
		this.unsubscribe()
	}

	componentWillReceiveProps(newProps) {
		this.initialState.gameId = newProps.match.params.gameId
		this.setState(this.initialState,
			() => {
				this.unsubscribe()
				this.subscribe()
				this.fillBoard()
			}
		)
	}

	subscribe() {
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

	unsubscribe() {
		Client.endSubscription(this.subscription)
	}

	fillBoard() {
		Client.loadGame(this.state.gameId, (game_data) => {
			this.setState(game_data)
			this.setState({loading: false})
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
		const gameType = this.state.gameType
		const currentUserId = Authentication.currentUser.id
		let game
		const props = {
				gameId: gameId,
				currentUserId: currentUserId,
				board: this.state.board,
				turn: this.state.turn,
				player1: this.state.player1,
				winner: this.state.winner,
				lastMove: this.state.lastMove,
				player1Piece: this.state.player1Piece,
				player2Piece: this.state.player2Piece
			}

		switch(gameType) {
			case "TicTacToe":
				game = <TicTacToe {...props}/>;
				break;
			case "Connect4":
				game = <Connect4 {...props}/>;
				break;
			case "Hex":
				game = <Hex {...props}/>;
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
		return this.state.turn === Authentication.currentUser.id
	}

	render() {

		if(this.state.newGameId){
			if(this.state.newGameId === "error"){
    	    	return <Redirect to="/" />
    	  	}
    	  	return <Redirect to={"/games/" + this.state.gameType +"/" + this.state.newGameId} />
    	}

		if (this.state.loading) {
			return Spinner()
		}

		const winner = this.state.winner;
		let status;
		let rematch;
		const piece = <div className={`color ${this.state.turn === this.state.player1 ? this.state.player1Piece : this.state.player2Piece}`}></div>
		if (winner) {
			status = this.state.winner === Authentication.currentUser.id ? "You Won!" : "You Lost."
			rematch = <div className="rematch btn" onClick={() => {
						Client.challenge(
							this.state.opponentId, 
							this.state.gameType,
							(response) => this.setState({newGameId: response.gameId}),
							(errors) => {
              				  this.setState({newGameId: "error"})
              				  errors.response.json().then(response => Flash.errors = response)
              				}
						)
					}}>
				Rematch
			</div>
		} else {
			status = this.state.turn === Authentication.currentUser.id ? "Your Turn" : "Opponent's Turn"
		}

		return (
			<div className="game">
				<div className="status">
					<div>{status}{!this.state.winner && piece}</div>
					{rematch}
				</div>
				<div className="game-board">
					{this.renderGame()}
				</div>
				<div className="bottom-game-section">
					{this.state.opponentWatching && this.renderOpponentWatching()}
					{this.renderNudge()}
					<Link to='/' className="btn game-btn">Back</Link>
				</div>
			</div>
			);
	}
}

export default GameRouter;
