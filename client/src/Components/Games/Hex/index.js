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
    if (this.props.winner || board[i.rowIndex][i.columnIndex] !== null || !this.myTurn()) {
      return;
    }
    board[i.rowIndex][i.columnIndex] = this.props.currentUserId;
    this.setState({
      board: board,
      turn: !this.state.turn
    });
    Client.updateBoard(this.props.gameId, [i.rowIndex, i.columnIndex])
  }

  render() {
    const classes = `board ${pieceFor(this.props.currentUserId, this.state.player1)}`;
    return (
      <div className="hex-board">
        <div className={classes}>
          {this.state.board.map((row, rowIndex) =>
            <div className="row">
              {row.map((piece, columnIndex) =>
                <HexPiece
                  className={piece !== null ? pieceFor(piece, this.state.player1) : ' empty '}
                  onClick={() => this.handleClick({rowIndex: rowIndex, columnIndex: columnIndex})}
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
  let piece = "blue"
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
