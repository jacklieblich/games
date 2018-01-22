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
			player1Watching: false,
			player2Watching: false,
			board: [],
			turn: "",
			winner: false,
			player1: "",
			player2: "",
			player1Piece: "",
			player2Piece: "",
			player1Record: "",
			player2Record: "",
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
		if (gameData.stoppedWatching === this.state.player1.id){
			this.setState({player1Watching: false})
		}
		if (gameData.stoppedWatching === this.state.player2.id){
			this.setState({player2Watching: false})
		}
		//cant hide watching status by closing secondary connection
		if (gameData.stoppedWatching === Authentication.currentUser.id){
			Client.imWatching({game_id: this.state.gameId})
		}
		// if (gameData.isWatching !== Authentication.currentUser.id){
		// 	Client.imWatching({game_id: this.state.gameId})
		// }
		if (gameData.isWatching === this.state.player1.id && !this.state.player1Watching){
			this.setState({player1Watching: true})
			Client.imWatching({game_id: this.state.gameId})
		}
		if (gameData.isWatching === this.state.player2.id && !this.state.player2Watching){
			this.setState({player2Watching: true})
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

	renderNudge() {
		if(!this.myTurn() && this.state.nudgable && !this.state.winner && !this.state.opponentWatching){
			return <button className="nudge" onClick={() => {
				Client.nudge(this.state.gameId)
				this.setState({nudgable: false})
			}}></button>
		}
	}

	myTurn(){
		return this.state.turn === Authentication.currentUser.id
	}

	renderSurrender() {
		if (!this.state.winner){
			return <div className="btn quit" onClick={() => Client.surrender(this.state.gameId)}>quit</div>
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
		if (playerId === this.state.player1.id && this.state.player1Watching){
			classes += " watching"
		}
		if (playerId === this.state.player2.id && this.state.player2Watching){
			classes += " watching"
		}
		if (playerId === Authentication.currentUser.id){
			classes += " self"
		}
		return classes;
	}

	playerBackground(player) {
		const playerData = {}
		if (player === "player1"){
		 	playerData.color = this.state.player1Piece
		 	playerData.id = this.state.player1.id
		}else{
			playerData.color = this.state.player2Piece
		 	playerData.id = this.state.player2.id
		}

		if (this.state.winner) {
			return playerData.color;
		}else{
			if(this.state.turn === playerData.id){
				return playerData.color;
			}else{
				 return playerData.color.substring(0, playerData.color.length-2) + ".5)"
			}
		}
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
				<div className="top-game-section">
					<Link to='/' className="btn back"></Link>
					{this.renderSurrender()}
					{this.state.winner && this.renderRematchButton()}
				</div>
				<div className="game-board">
					{this.renderGame()}
				</div>
				<div className="player-display">
					<div style={{backgroundColor: this.playerBackground("player1")}} className={this.playerClasses(this.state.player1.id)}>
						<div className="image-wrapper">
							{this.renderPlayerImage(this.state.player1)}
							{this.renderNudge()}
						</div>
						<div className="user-info">
							<p>{this.state.player1.username}</p>
							<p>{this.state.player1Record.wins} - {this.state.player1Record.losses}</p>
						</div>
					</div>
					<div style={{backgroundColor: this.playerBackground("player2")}} className={this.playerClasses(this.state.player2.id)}>
						<div className="image-wrapper">
							{this.renderPlayerImage(this.state.player2)}
							{this.renderNudge()}
						</div>
						<div className="user-info">
							<p>{this.state.player2.username}</p>
							<p>{this.state.player2Record.wins} - {this.state.player2Record.losses}</p>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default GameRouter;
