import React from 'react';
import TicTacToe from "../Games/TicTacToe";
import Connect4 from "../Games/Connect4";
import Hex from "../Games/Hex";
import { Authentication } from '../../Authentication';
import { Link, Redirect } from 'react-router-dom';
import Client from "../../api";
import { Spinner } from '../Spinner';
import { Flash } from '../flash';
import DefaultUserImage from '../images/default_user.svg'
import './styles.css';

class GameRouter extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = {
			opponentWatching: false,
			board: [],
			turn: "",
			winner: false,
			player1: "",
			player2: "",
			player1Piece: "",
			player2Piece: "",
			lastMove: "",
			nudgable: true,
			loading: true,
			gameType: props.match.params.gameType,
			newGameId: false,
			opponent: false
		}
		this.initialState.gameId = props.match.params.gameId
		this.state = this.initialState
		this.fillBoard = this.fillBoard.bind(this)
	}

	componentDidMount() {
		this.fillBoard()
	}

	componentWillUnmount() {
		this.unsubscribe()
	}

	//handles rematch
	componentWillReceiveProps(newProps) {
		this.initialState.gameId = newProps.match.params.gameId
		this.setState(this.initialState,
			() => {
				this.unsubscribe()
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
		Client.loadGame(this.state.gameId, (gameData) => {
			gameData.opponent = [gameData.player1, gameData.player2].find((player) => player.id != Authentication.currentUser.id)
			this.setState(gameData, () => this.subscribe())
			this.setState({loading: false})
		})
	}

	handleOpponentWatching(gameData) {
		if (this.state.opponent){
			if (gameData.stoppedWatching === this.state.opponent.id){
				this.setState({opponentWatching: false})
			}
			//cant hide watching status by closing secondary connection
			if (gameData.stoppedWatching === Authentication.currentUser.id){
				Client.imWatching({game_id: this.state.gameId})
			}
			if (gameData.isWatching === this.state.opponent.id && !this.state.opponentWatching){
				this.setState({opponentWatching: true})
				Client.imWatching({game_id: this.state.gameId})
			}
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
				player1: this.state.player1.id,
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
				Client.nudge(this.state.gameId)
				this.setState({nudgable: false})
			}}>( •_•)σ</button>
		}
	}

	myTurn(){
		return this.state.turn === Authentication.currentUser.id
	}

	renderSurrender() {
		if (!this.state.winner){
			return <div className="btn surrender" onClick={() => Client.surrender(this.state.gameId)}>surrender</div>
		}
	}

	renderPlayerImage(player) {
		return <img src={player.uid != null ? `https://graph.facebook.com/v2.11/${player.uid}/picture?type=normal` : DefaultUserImage}/>
	}

	renderRematchButton() {
		return (
			<div className="rematch btn" onClick={() => {
						Client.challenge(
							this.state.opponent.id, 
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
		)
	}

	playerClasses(playerId) {
		let classes = ""
		if (this.state.winner) {
			classes += "turn"
			if (this.state.winner === playerId){
				classes += " winner"
			}
		}else{
			if(this.state.turn === playerId){
				classes += "turn"
			}
		}
		return classes;
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

		return (
			<div className="game">
				<div className="game-board">
					{this.renderGame()}
				</div>
				<div className="player-display">
					<div style={{backgroundColor: this.state.player1Piece}} className={this.playerClasses(this.state.player1.id)}>
						{this.renderPlayerImage(this.state.player1)}
					</div>
					<div style={{backgroundColor: this.state.player2Piece}} className={this.playerClasses(this.state.player2.id)}>
						{this.renderPlayerImage(this.state.player2)}
					</div>
				</div>
				<div className="bottom-game-section">
					{this.state.opponentWatching && this.renderOpponentWatching()}
					{this.renderNudge()}
					{this.renderSurrender()}
					{this.state.winner && this.renderRematchButton()}
				</div>
				<Link to='/' className="btn bottom">Back</Link>
			</div>
			);
	}
}

export default GameRouter;
