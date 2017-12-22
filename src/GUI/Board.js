import React from "react";
import { Square } from "./Square";
import { GamePiece } from "./GamePiece";
import {} from "./GUIstyle.css";

export class Board extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);
    this.state = {
      squares: this.createArray(),
      squareWeights:[
        [99, -8, 8, 6, 6, 8, -8, 99],
        [-8, -24, -4, -3, -3, -4, -24, -8],
        [8, -4, 7, 4, 4, 7, -4, 8],
        [6, -3, 4, 0, 0, 4, -3, 6],
        [6, -3, 4, 0, 0, 4, -3, 6],
        [8, -4, 7, 4, 4, 7, -4, 8],
        [-8, -24, -4, -3, -3, -4, -24, -8],
        [99, -8, 8, 6, 6, 8, -8, 99],
      ],
      computerPlayerActive: this.props.computerPlayerActive,
      strategy: "minimax",
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

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  getBoardHeuristic(board) {
    // console.log("GETTING BOARD HEURISTIC");
    var p1Heuristic=0;
    var p2Heuristic=0;
    var squares = board;
    // console.log(squares);
    const weights = this.state.squareWeights;
    for(var i = 0; i<=7; i++){
      for(var j =0; j<=7; j++){
          if(squares[i][j]!== null){
            if(squares[i][j] === "w"){
              p1Heuristic+=weights[i][j];
            }else if(squares[i][j] === "p"){
              p2Heuristic+=weights[i][j];
            }
          }
        }
      }
      return [p1Heuristic,p2Heuristic];
    }
  handleClick(a, b, computerTurnNext) {
    console.log("CURRENT POSITION: "+a+","+b);
    if(this.inRange(a,b)){
      var flips = this.checkForFlips(a,b,this.state.currentTurn);
      if(flips.required){
        const squares = this.state.squares.slice();
        squares[a][b] = this.state.currentTurn;

        var newState = this.flipPieces(flips,squares);
        console.log("NewState: "+newState.currentTurn);
        this.setState({squares:squares, currentTurn:newState.currentTurn});
        this.updateScore();
        var p1AvailableMoves = this.checkForAnyValidMoves("w");
        var p2AvailableMoves = this.checkForAnyValidMoves("p");
        // console.log("MOVES AVAILABLE FOR W: " + p1AvailableMoves.moves);
        // console.log("MOVES AVAILABLE FOR P: " + p2AvailableMoves.moves);
        if (!p1AvailableMoves.movesAvailable && !p2AvailableMoves.movesAvailable) {
          console.log("GAME OVER");
        } else if ((this.state.currentTurn === "w" && !p1AvailableMoves) || (this.state.currentTurn === "p" && !p2AvailableMoves)) {
          console.log("NO MOVES SWITCH TURN");
          var newTurn = this.state.currentTurn === "w"?"p":"w";
          this.setState({currentTurn:newTurn});
        }
      }
      // console.log("P1_HEURISTIC: "+boardState[0]+" P2_HEURISTIC: "+boardState[1]);
      console.log("COMPUTER TURN?" + this.state.computerPlayerActive+"&&"+computerTurnNext);
      this.sleep(50).then(()=> {console.log("YOOOOOO")});
      if(this.state.computerPlayerActive && computerTurnNext){
        var boardState = this.getBoardHeuristic(this.state.squares);
        this.sleep(50).then(()=>{
        this.computersTurn(this.state.strategy, [a, b], boardState);  
        });
        // console.log(boardState);
      }
    }
  }

  computersTurn(strategy,lastPiecePlaced,boardState) {
    console.log("CURRENT TURN: "+this.state.currentTurn);
    const squares = this.state.squares.slice();
    if(strategy === "minimax"){
      var currentHeuristicScore = boardState[0] - boardState[1];
      console.log("STARTING SCORE: "+currentHeuristicScore);
      console.log(squares);
      var maxLevel = 1;
      var heuristicAndPieceLocation = {
        position:lastPiecePlaced,
        HeuristicScore:currentHeuristicScore
      };
      var selectedMove = this.minimax(heuristicAndPieceLocation,0,maxLevel,"p",squares);
      console.log("SELECTED MOVE: "+selectedMove.position);
      console.log("SELECTED MOVE HEURISTIC: "+selectedMove.HeuristicScore);
      this.handleClick(selectedMove.position[0],selectedMove.position[1],false);
    }
  }

  minimax(hapl,currentLevel,maxLevel,currentPlayer,board){ //hapl = heuristic and piece location
    var currentState;
    var currentHeuristicScore;
    var y;
    var x;
    var bestOfEachBranch = [];
    var selection = {
      position: null,
      HeuristicScore: 999
    };
    console.log("CURRENT LEVEL: "+currentLevel);
    console.log("BEST SCORE: " + hapl.HeuristicScore);
    if(currentLevel === maxLevel){
      // var y = hapl.position[0];
      // var x = hapl.position[1];
      // board[y][x] = null;

      // console.log("Chosen Move: "+lastPiecePlaced);
      // currentState = this.getBoardHeuristic(board);
      // currentHeuristicScore = currentState[0] - currentState[1];
      // console.log(currentHeuristicScore);
      return hapl;
    }else{
      console.log("hello");
      var validMoves = this.checkForAnyValidMoves(currentPlayer);
      currentLevel++;
      console.log("VALID MOVES: "+validMoves.moves);
      for(var i = 0; i<validMoves.moves.length;i++){
        y = validMoves.moves[i][0];
        x = validMoves.moves[i][1];
        console.log("CHECKING MOVE: "+y+","+x);
        board[y][x] = currentPlayer;
        console.log("BOARD: "+board);
        currentState = this.getBoardHeuristic(board);
        // console.log("currentState[0]: "+currentState[0]);
        // console.log("currentState[1]: "+currentState[1]);
        currentHeuristicScore = currentState[0] - currentState[1];
        hapl.position=[y,x];
        console.log("HEURISTIC RESULT: "+currentHeuristicScore);
        if (currentPlayer === "p"){
          // console.log("P");
          if(currentHeuristicScore < hapl.HeuristicScore){
            hapl.HeuristicScore = currentHeuristicScore;
          }
          bestOfEachBranch.push(this.min(hapl, this.minimax(hapl, currentLevel, maxLevel, "w", board)));
        } else if (currentPlayer === "w"){
          // console.log("W");
          if (currentHeuristicScore > hapl.HeuristicScore){
            hapl.HeuristicScore = currentHeuristicScore;
          }
          hapl.HeuristicScore = this.max(hapl,this.minimax(hapl,currentLevel,maxLevel,"p",board));
        }
        board[y][x] = null;
      }
      for(var j = 0; j<validMoves.moves.length; j++){
        if(bestOfEachBranch[j].HeuristicScore < selection.HeuristicScore){
          console.log("HELLOOOOO");
          selection.position = bestOfEachBranch[j].position;
          selection.HeuristicScore = bestOfEachBranch[j].HeuristicScore;
        }
        // console.log(bestOfEachBranch[j]);
        // console.log(j);
      }
      console.log("POSITION: "+selection.position);
      console.log("HEURISTIC: "+selection.HeuristicScore);
      return selection;
    }


  }

  min(hapl,minimaxReturnValue){
    return hapl.HeuristicScore <= minimaxReturnValue.HeuristicScore ? hapl : minimaxReturnValue;
  }

  max(hapl,minimaxReturnValue){
    return hapl.HeuristicScore >= minimaxReturnValue.HeuristicScore ? hapl : minimaxReturnValue;
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

    for(var i = 0; i<directions.length; i++){
      var y_check = y + directions[i][0];
      var x_check = x + directions[i][1];
      while ((y_check >= 0 && y_check <= 7) && (x_check >= 0 && x_check <= 7) &&
        squares[y_check][x_check] !== null) {
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
      };
    }else{
      return {
        required: false,
        squaresToFlip: null,
        flipToColor: "invalidTurn"
      };
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
    var switchTurn = this.state.currentTurn === "w" ? "p" : "w";
    for(var i=0; i<length; i++){
      squares[array[i][0]][array[i][1]] = flipInfo.flipToColor;
    }
    return {
      squares:squares,
      currentTurn:switchTurn,
    };
  }


  checkForAnyValidMoves(currentTurn) {
    var moveAvailable;
    var count = 0;
    var validMoves = [];
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        moveAvailable = this.isValidMove(y, x, true, currentTurn);
        if(moveAvailable.valid) {
          // console.log(moveAvailable.position);
          validMoves.push(moveAvailable.position);
          count++;
        }
      }
    }
    // console.log("ONE VALID MOVE is: "+validMoves[0][0]+","+validMoves[0][1]);
    if (count === 0) {
      // return false;
      return {
        movesAvailable:false,
        moves:[]
      };
    }
    // return true;
    return {
      movesAvailable:true,
      moves:validMoves
    };
  }


  isValidMove(y,x,checkingForPossibleMoves,currentTurn){ //checkingForPossibleMoves is set to true when calling this function
    const squares = this.state.squares.slice();          //in the onComponentMount function, which is used to verify there
    // console.log("VALUE @ LOCATION CLICKED: "+squares[y][x]);
    if(squares[y][x] !== "w" && squares[y][x] !== "p"){  //is at least one move for the current turn, otherwise the turn skips.
      if (this.inRange(y, x) || checkingForPossibleMoves) {
        var flips = this.checkForFlips(y, x,currentTurn);
        if (flips.required) {
          if(!checkingForPossibleMoves){
            squares[y][x] = "pos_"+currentTurn;
            this.setState({ squares: squares });
          }else{
            return {
              valid:true,
              position:[y,x]
            };    
          }
        
        }
      }
    }
    return {
      valid: false,
      position: null
    };
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
    this.setState({p1_score:p1NewScore, p2_score:p2NewScore});
  }
  
  renderScoreBoard(currentTurn) {
    var arrow;
    if(currentTurn === "w"){
      arrow = "arrow-left";
    }else if(currentTurn === "p"){
      arrow = "arrow-right";
    }
    return (
      <div>
        <div className="score-board-p1">{this.state.p1_score}</div>
        <div className={arrow}></div>
        <div className="score-board-p2">{this.state.p2_score}</div>
      </div>
    )
  }

  renderSquare(c, d, val) {
    // console.log("CURRENT TURN: "+this.state.currentTurn);
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
        onClick={() => this.handleClick(c, d, true)}
        onMouseEnter={() => this.isValidMove(c, d, false, this.state.currentTurn)}
        onMouseLeave={() => this.removeValidMoveIndicator(c, d)}
      />
    );
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
        {this.renderScoreBoard(this.state.currentTurn)}
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
