import React from "react";
import { Square } from "./Square";
import { GamePiece } from "./GamePiece";
import {} from "./GUIstyle.css";

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: this.createArray(),
      p1_piece: <GamePiece player="player-one-piece" />,
      p2_piece: <GamePiece player="player-two-piece" />,
      p1_score: this.props.p1InitialScore,
      p2_score: this.props.p2InitialScore,
      currentTurn: this.props.initialTurn,
      x_min: 2,
      x_max: 5,
      y_min: 2,
      y_max: 5

    };
  }
  createArray() {
    var arr = new Array(8);
    for (var i = 0; i < 8; i++) {
      arr[i] = new Array(8);
    }
    for (var a = 0; a < 8; a++) {
      for (var b = 0; b < 8; b++) {
        arr[a][b] = null;
      }
    }
    arr[3][3]='w';
    arr[3][4]='b';
    arr[4][3]='b';
    arr[4][4]='w';
    return arr;
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
    console.log("y_min: "+this.state.y_min +" y_max: "+this.state.y_max+" x_min: "+this.state.x_min+" x_max: "+this.state.x_max);
    if(this.inRange(a,b)){
      const squares = this.state.squares.slice();
      if (squares[a][b] === null) {
        if (this.state.currentTurn === "w") {
          squares[a][b] = this.state.currentTurn;
        } else {
          squares[a][b] = this.state.currentTurn;
        }
        this.setState({
          squares: squares,
          currentTurn: this.state.currentTurn === "w" ? "b" : "w"
        });
      }
      console.log(a + " " + b + " placed!");
      this.updateRange(a,b);
      // console.log("y_min: " + this.state.y_min + " y_max: " + this.state.y_max + " x_min: " + this.state.x_min + " x_max: " + this.state.x_max);
    }else{
      console.log(a+" "+b+" not in range!");
    }
  }

  inRange(y,x){
    if(y >= this.state.y_min && y<= this.state.y_max){
      if(x >= this.state.x_min && x<= this.state.x_max){
        return (true);
      }
    }return (false);
  }
  updateRange(y,x){
    var y_min_ = this.state.y_min;
    var y_max_ = this.state.y_max;
    var x_min_ = this.state.x_min;
    var x_max_ = this.state.x_max;
    if(y === y_min_ && y_min_ !==0){
      y_min_ = y - 1;
    }
    if (y === y_max_&& y_max_ !== 7){
      y_max_ = y + 1;
    }
    if (x === x_min_&& x_min_ !== 0){
      x_min_ = x - 1;
    }
    if (x === x_max_ && x_max_ !== 0){
      x_max_ = x + 1;
    }
    this.setState({y_min:y_min_,
                   y_max:y_max_,
                   x_min:x_min_,
                   x_max:x_max_});
    console.log("y_min: " + y_min_ + " y_max: " + y_max_ + " x_min: " + x_min_ + " x_max: " + x_max_);
  }
  // x_min: 2,
  // x_max: 5,
  // y_min: 2,
  // y_max: 5

  
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
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    );
  }
}
