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
      currentTurn: 'w',
      directions: [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]]
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
    arr[3][4]='p';
    arr[4][3]='p';
    arr[4][4]='w';
    return arr;
  }

  renderSquare(c, d, val) {
    if(val !== null){
      // console.log("VAL: " + val);
    }
    return (
      <Square
        value={
          val === "w" || val === "pos_w" ? (
            <GamePiece player="player-one-piece" />
          ) : val === "p" || val === "pos_p" ? (
            <GamePiece player="player-two-piece" />
          ) : null
        }
        yValue={c}
        xValue={d}
        onClick={() => this.handleClick(c, d)}
        onMouseEnter={() => this.isValidMove(c, d,false,this.state.currentTurn)}
        onMouseLeave={() => this.removeValidMoveIndicator(c,d)}
      />
    );
  }

//   function incrementFooBy(delta) {
//   return (previousState, currentProps) => {
//     return { ...previousState, foo: previousState.foo + delta };
//   };
// }
// class MyComponent extends React.Component {
//   onClick = () => {
//     this.setState(incrementFooBy(42));
//   }
  changeCurrentTurnAndBoardState(newState){
    console.log("hmph: "+newState.currentTurn);
    return (previousState, currentProps) => {
      return { ...previousState, squares:newState.squares,currentTurn: newState.currentTurn}
    }
  };

  handleClick(a, b) {

    if(this.inRange(a,b)){
      console.log("HANDLE CLICK CURRENT TURN ON ENTRY: "+this.state.currentTurn);
      var flips = this.checkForFlips(a,b,this.state.currentTurn);
      if(flips.required){
        const squares = this.state.squares.slice();
        squares[a][b] = this.state.currentTurn;
        

        var newState = this.flipPieces(flips,squares);
        console.log("NEW TURN: "+newState.currentTurn);
        console.log("NEW BOARD: "+newState.squares);
        this.setState(this.changeCurrentTurnAndBoardState(newState),console.log("WHAT: "+this.state.currentTurn + " "+this.state.squares));
        this.updateScore();
        var currentTurn = this.state.currentTurn;
        var p1AvailableMove = this.checkForAnyValidMove("w");
        var p2AvailableMove = this.checkForAnyValidMove("p");
        if (!p1AvailableMove && !p2AvailableMove) {
          console.log("GAME OVER");
        }else if ((currentTurn === "w" && !p1AvailableMove) || (currentTurn === "p" && !p2AvailableMove)) {
          console.log("NO MOVES SWITCH TURN");
          var newTurn = currentTurn === "w"?"p":"w";
          this.setState({currentTurn:newTurn},console.log(this.state.currentTurn));
        }else{
          console.log("Current Turn: " + this.state.currentTurn);
        }
      }
    }
  }

  inRange(y,x){
    var currentY;
    var currentX;
    for(var i = -1; i<2; i++){
      for(var j = -1; j<2; j++){
        currentY = y+i;
        currentX = x+j;
        if(currentY >=0 && currentY <=7 && currentX >=0 && currentX<=7){
          if(this.state.squares[currentY][currentX] !== null &&
             this.state.currentTurn !== this.state.squares[currentY][currentX]) {
            return true;
          }
        }
      }
    } 
    return false;
  }
  checkForFlips(y,x,currentTurn){
    const directions = this.state.directions;
    const squares = this.state.squares.slice();
    var squaresToFlip = [];
    var flipToColor = currentTurn === "w" ? "w" : "p";
    var counter = 0;


    for(var i = 0; i<directions.length; i++){
      var y_check = y + directions[i][0];
      var x_check = x + directions[i][1];
      while ((y_check >= 0 && y_check <= 7) && (x_check >= 0 && x_check <= 7) &&
        squares[y_check][x_check] !== null && counter<25) {
          counter++;
        if(squares[y_check][x_check] !== currentTurn) {
          var bracketResult = this.checkForBracket(y_check,x_check,directions[i][0],directions[i][1],currentTurn);
          if(bracketResult){
            squaresToFlip.push([y_check, x_check]);
          }
        }else{
          break;
        }
        y_check += directions[i][0];
        x_check += directions[i][1]; 
      }
    }
    if(squaresToFlip[0]!==undefined){
      return {
        required: true,
        squaresToFlip: squaresToFlip,
        flipToColor: flipToColor
      }
    }else{
      return {
        required: false,
        squaresToFlip: null,
        flipToColor: "invalidTurn"
      }
    }
  }

  checkForBracket(y,x,y_mod,x_mod,currentTurn){
    var count=0;
    const squares = this.state.squares.slice()
    while(y>=0 && y<=7 && x>=0 && x<=7){
      if(squares[y][x] === null){
        return false;
      }
      else if(squares[y][x]!==currentTurn){
        y=y+y_mod;
        x=x+x_mod;
        count++;
      }else if(squares[y][x] === currentTurn){
        if(count === 0){
          return false;
        }else{
          return true;
        }

      }
    }

  }

  flipPieces(flipInfo,squares){
    var array = flipInfo.squaresToFlip;
    var length = array.length;
    const switchTurn = this.state.currentTurn === "w" ? "p" : "w";
    console.log("SWITCH TURN: "+switchTurn);
    for(var i=0; i<length; i++){
      squares[array[i][0]][array[i][1]] = flipInfo.flipToColor;
    }
    return {
      squares:squares,
      currentTurn:switchTurn
    };
  }

  isValidMove(y,x,checkingForPossibleMoves,currentTurn){ //checkingForPossibleMoves is set to true when calling this function
    const squares = this.state.squares.slice();          //in the onComponentMount function, which is used to verify there
    if(squares[y][x] !== "w" && squares[y][x] !== "p"){  //is at least one move for the current turn, otherwise the turn skips.
      if (this.inRange(y, x)) {
        var flips = this.checkForFlips(y, x,currentTurn);
        if (flips.required) {
          if(!checkingForPossibleMoves){
            squares[y][x] = "pos_"+currentTurn;
            this.setState({ squares: squares });
          }else{
            return true;
          }
        }
        return false;
      }
    }
  }

  checkForAnyValidMove(currentTurn){
    var moveAvailable;
    var count = 0;
    for(var y = 0; y <= 7; y++){
      for(var x = 0; x <= 7; x++){
        moveAvailable=this.isValidMove(y,x,true,currentTurn);
        if(moveAvailable){
          count++;
        }
      }
    }
    console.log("NUMBER OF VALID MOVES FOR "+currentTurn+": "+count);
    if( count === 0){
      return false
    }
    return true;
  }

  removeValidMoveIndicator(y,x){
    const squares = this.state.squares.slice();
    if(squares[y][x] === "pos_p" || squares[y][x] === "pos_w"){
      squares[y][x]=null;
      this.setState({squares:squares});
    }
  }



  updateScore(){
    var p1NewScore = 0;
    var p2NewScore = 0;
    for(var i =0; i<=7;i++){
      for(var j=0; j<=7; j++){
        if(this.state.squares[i][j]==="w"){
          p1NewScore++;
        }else if(this.state.squares[i][j]==="p"){
          p2NewScore++;
        }
      }
    }
    this.setState({p1_score:p1NewScore, p2_score:p2NewScore},console.log("updated score"));
  }
  
  renderScoreBoard() {
    return (
      <div>
        <div className="score-board-p1">{this.state.p1_score}</div>
        <div className="score-board-p2">{this.state.p2_score}</div>
      </div>
    )
  }

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
        {this.renderScoreBoard()}
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
