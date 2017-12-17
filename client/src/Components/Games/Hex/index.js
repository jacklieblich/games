import React from 'react';
import Client from "../../../api";
import HexPiece from "./HexPiece";
import './styles.css';


class Hex extends React.Component {
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

  render() {
    const winner = this.props.winner;
    let status;
    if (winner) {
      status = 'Winner: ' + pieceFor(winner, this.state.player1);
    } else {
      status = 'Next player: ' + pieceFor(this.state.turn, this.state.player1);
    }

    return (
      <div className="hex-board">
        <div className="status">{status}</div>
        <div className="board">
          {this.state.board.map((row, rowIndex) =>
            <div className="row">
              {row.map((piece, columnIndex) =>
                <HexPiece
                  piece={piece}
                  onClick={this.handleClick.bind(this, rowIndex, columnIndex)}
                />
              )}
            </div>
          )}
        </div>
      </div>
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

export default Hex;
