import React from "react";
import { Square } from "./Square";
import { GamePiece } from "./GamePiece";
import {} from "./GUIstyle.css";

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(Array(9).fill(null)),
      p1_piece: <GamePiece player="player-one-piece" />,
      p2_piece: <GamePiece player="player-two-piece" />,
      p1_score: this.props.p1InitialScore,
      p2_score: this.props.p2InitialScore,
      currentTurn: this.props.initialTurn
    };
  }

  renderSquare(c, d, val) {
    // console.log("current square: "+c+","+d+" val: "+val);
    return (
      <Square
        value={
          val === "w" ? (
            this.state.p1_piece
          ) : val === "b" ? (
            this.state.p2_piece
          ) : null
        }
        onClick={() => this.handleClick(c, d)}
      />
    );
  }

  handleClick(a, b) {
    console.log("a & b: "+a+" "+b)
    const squares = this.state.squares.slice();
    if (squares[a][b] === null) {
      if (this.state.currentTurn === "w") {
        squares[a][b] = this.state.currentTurn;
      } else {
        squares[a][b] = this.state.currentTurn;
      }
      this.setState({ squares: squares,
        currentTurn: this.state.currentTurn ==='w'? 'b':'w' });
      console.log(this.state.squares);
    }
    // this.checkForFlips();
  }

  // checkForFlips(){

  // }
  renderRow(i) {
    return (
      <div className="board-row">
        {this.renderSquare(i, 0, this.state.squares[i][0])}
        {this.renderSquare(i, 1, this.state.squares[i][1])}
        {this.renderSquare(i, 2, this.state.squares[i][2])}
        {this.renderSquare(i, 3, this.state.squares[i][3])}
        {this.renderSquare(i, 4, this.state.squares[i][4])}
        {this.renderSquare(i, 5, this.state.squares[i][5])}
        {this.renderSquare(i, 6, this.state.squares[i][6])}
        {this.renderSquare(i, 7, this.state.squares[i][7])}
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(0)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    );
  }
}
