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
    const classes = `board ${this.pieceFor(this.props.currentUserId)}`;
    return (
      <div className="hex-board">
        <div className={classes}>
          {this.state.board.map((row, rowIndex) =>
            <div className="row" key={rowIndex}>
              {row.map((piece, columnIndex) =>
                <HexPiece
                  key={rowIndex*11 + columnIndex}
                  className={piece !== null ? this.pieceFor(piece) : ' empty '}
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

export default Hex;
