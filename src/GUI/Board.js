import React from "react";
import { Square } from "./Square";
import { GamePiece } from "./GamePiece";
import {} from "./GUIstyle.css";


/*Hello! Please view this program in fullscreen! It will represent the GUI in the best light.
to do so hover over that blue rectangle above and click on the full orange-ish one that says "Show Preview View"
then when in that view towards the top where the url is if you look to the right you will see a square with
an arrow in it, that will open the GUI in a new tab and you will see it in all its glory! Please enjoy this code
I spent a lot of time working on this and really did enjoy it, while also learned a lot. I hope the comments
are sufficient enough to explain this code on its own, but a brief overview of the program is in the paper as well.
*/

export class Board extends React.Component {
  constructor(props) {
    super(props);
    console.log("Welcome to Othello! Click on the boardto place your first move!");
    console.log("Then wait for the AI to make its move! Don't click during this time, or else bugs arise!");
    this.state = {
      squares: this.createArray(), //board representation as a 2D array of squares
      squareWeights:[ //weights of each of those squares based on position, used to calculate heuristic
        [99, -8, 8, 6, 6, 8, -8, 99],
        [-8, -24, -4, -3, -3, -4, -24, -8],
        [8, -4, 7, 4, 4, 7, -4, 8],
        [6, -3, 4, 0, 0, 4, -3, 6],
        [6, -3, 4, 0, 0, 4, -3, 6],
        [8, -4, 7, 4, 4, 7, -4, 8],
        [-8, -24, -4, -3, -3, -4, -24, -8],
        [99, -8, 8, 6, 6, 8, -8, 99],
      ],
      computerPlayerActive: true,
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

  getBoardHeuristic(board) { //pretty self explanitory, used to calcualte heuristic of board passed in.
    var p1Heuristic=0;
    var p2Heuristic=0;
    var squares = board;
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
  handleClick(a, b,computerNextTurn) { //main function of this program all updates to the board go through here
    if(!this.state.gameOver){
      const squares = this.state.squares.slice();
      if (this.inRange(a, b)) {
        var flips = this.checkForFlips(a, b, this.state.currentTurn, squares); //checks if the presented piece causes any flips
        if (flips.required) {
          squares[a][b] = this.state.currentTurn;

          var newState = this.flipPieces(flips, squares); //flips the pieces that were determined to be flipped by checkForFlips()
          this.setState({ squares: newState.squares, currentTurn: newState.currentTurn }); //update the board with the newly flipped pieces
          this.updateScore();
          var p1AvailableMoves = this.checkForAnyValidMoves("w", newState.squares);
          var p2AvailableMoves = this.checkForAnyValidMoves("p", newState.squares);
          if (!p1AvailableMoves.movesAvailable && !p2AvailableMoves.movesAvailable) {
            console.log("GAME OVER");
            this.setState({ gameOver: true });
          } else if ((this.state.currentTurn === "w" && !p1AvailableMoves) || (this.state.currentTurn === "p" && !p2AvailableMoves)) {
            console.log("NO MOVES SWITCH TURN");
            var newTurn = this.state.currentTurn === "w" ? "p" : "w";
            computerNextTurn = !computerNextTurn;
            this.setState({ currentTurn: newTurn });
          }
        }
        
        if (this.state.computerPlayerActive && computerNextTurn) {
          var boardState = this.getBoardHeuristic(this.state.squares);
          this.sleep(1).then(() => {
            this.computerTurn(this.state.strategy, [a, b], boardState); //calls function responsible for calling minimax
          });
        }
      }
    }
  }

  computerTurn(strategy,lastPiecePlaced,boardState) {
    const squares = this.state.squares.slice();
    if(strategy === "minimax"){
      var maxLevel = 3; //determines the depth of which the minimax function will search the tree
      var currentLevel = 0;
      var lastMove = [0,0];
      var t0 = performance.now(); // for determining time minimax takes
      var selectedMove = this.minimax(currentLevel,maxLevel,"p",squares,lastMove); //minimax! Determines best move based on depth searched 
      this.handleClick(selectedMove.position[0],selectedMove.position[1],false); //calls handleClick to place the piece determined by minimax
      var t1 = performance.now();// minimax time
      console.log("Minimax Execution time (depth = "+maxLevel+") : "+ (t1 - t0) + " milliseconds");
      console.log("Number of nodes Searched: "+selectedMove.nodesSearched);
    }
  }

  minimax(currentLevel,maxLevel,currentPlayer,board,lastMove){ 
    var currentState;
    var currentHeuristicScore;
    var y;
    var x;
    var selection = {
      position: null,
      HeuristicScore: 999,
      nodesSearched: 1
    };
    if(currentLevel === 0){ //ignore root node in count of nodes searched
      selection.nodesSearched--;
    }
    selection.HeuristicScore = currentLevel%2 ? -999 : 999; //999 default "best score" for min nodes, -999 for max nodes
    if(currentLevel === maxLevel){ //leaf node return
      currentState = this.getBoardHeuristic(board);
      currentHeuristicScore = currentState[0] - currentState[1];
      return {
        position: lastMove,
        HeuristicScore: currentHeuristicScore,
        nodesSearched: 1
      };
    }
    else{
      var validMoves = this.checkForAnyValidMoves(currentPlayer,board); //finds valid moves as options for minimax to pick, essentially the nodes
      currentLevel++;
      for(var i = 0; i<validMoves.moves.length;i++){
        y = validMoves.moves[i][0];
        x = validMoves.moves[i][1];
        var flips = this.checkForFlips(y,x,currentPlayer,board); //check for flips just like in handleclick
        if(flips.required){
          board[y][x] = currentPlayer;
          var newBoard = this.flipPieces(flips,board); //create new board representing this state with one of the valid moves selected
          selection.position=[y,x]; //recording that position
        }

        if (currentPlayer === "p"){
          var checkValP = this.minimax(currentLevel, maxLevel, "w", newBoard.squares, [y, x]); // calling minimax on children of min node
          selection.nodesSearched += checkValP.nodesSearched;
          
        
          if (checkValP.HeuristicScore < selection.HeuristicScore) {
            selection.HeuristicScore = checkValP.HeuristicScore; //updating "best"
          }
          
        }else if (currentPlayer === "w"){
          var checkValW = this.minimax(currentLevel, maxLevel, "p", newBoard.squares, [y, x]); // calling minimax on children of max node
          selection.nodesSearched += checkValW.nodesSearched;
          
          if (checkValW.HeuristicScore > selection.HeuristicScore) {
            selection.HeuristicScore = checkValW.HeuristicScore; //updating "best"
          }
        }
        board[y][x] = null;
      }
      return selection;
    }
  }

  inRange(y,x){ //determine if selected position in range, i.e. adjacent to an opposite color piece
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
  checkForFlips(y,x,currentTurn,board){ //checking for flips! this calls check for brackets which sees if the piece
    const directions = this.state.directions; //surounds at least one opposite color piece
    const squares = JSON.parse(JSON.stringify(board)); 
    var squaresToFlip = [];
    var flipToColor = currentTurn === "w" ? "w" : "p";

    for(var i = 0; i<directions.length; i++){ //search whole board for flips!
      var y_check = y + directions[i][0];
      var x_check = x + directions[i][1];
      while ((y_check >= 0 && y_check <= 7) && (x_check >= 0 && x_check <= 7) &&
        squares[y_check][x_check] !== null) {
        if(squares[y_check][x_check] !== currentTurn) {
          //heres that bracket function call
          var bracketResult = this.checkForBracket(y_check,x_check,directions[i][0],directions[i][1],currentTurn,squares);
          if(bracketResult){
            squaresToFlip.push([y_check, x_check]);
          }
        }else{
          break;
        }
        y_check += directions[i][0]; // directions is an array of each direction around a piece
        x_check += directions[i][1]; //these two lines just continue in whatever direction its going now to search for flips
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

  checkForBracket(y,x,y_mod,x_mod,currentTurn,board){//BRACKETS! you know the deal, clamping down on opposite color pieces
    var count=0;
    const squares = JSON.parse(JSON.stringify(board));
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

  flipPieces(flipInfo,squares){ //does the actual flipping of pieces
    const board = JSON.parse(JSON.stringify(squares));
    var array = flipInfo.squaresToFlip;
    var length = array.length;
    var switchTurn = this.state.currentTurn === "w" ? "p" : "w";
    for(var i=0; i<length; i++){
      board[array[i][0]][array[i][1]] = flipInfo.flipToColor;
    }
    return {
      squares:board,
      currentTurn:switchTurn,
    };
  }


  checkForAnyValidMoves(currentTurn,board) { //checks entire board for valid moves, helper function for isvalidmove
    var moveAvailable;
    var count = 0;
    var validMoves = [];
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        moveAvailable = this.isValidMove(y, x, true, currentTurn,board);
        if(moveAvailable.valid) {
          validMoves.push(moveAvailable.position);
          count++;
        }
      }
    }
    if (count === 0) {
      return {
        movesAvailable:false,
        moves:[]
      };
    }
    return {
      movesAvailable:true,
      moves:validMoves
    };
  }


  isValidMove(y, x, checkingForPossibleMoves, currentTurn, board) { // determines if position passed to it is valid by checking for flips      
    var squares = JSON.parse(JSON.stringify(board));        
    if(squares[y][x] !== "w" && squares[y][x] !== "p"){  
      if (this.inRange(y, x) || checkingForPossibleMoves) {
        var flips = this.checkForFlips(y, x,currentTurn, squares);
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

  removeValidMoveIndicator(y,x){ //called after mouse leaves square of where an indicator for possible move was
    const squares = this.state.squares.slice();
    if(squares[y][x] === "pos_p" || squares[y][x] === "pos_w"){
      squares[y][x]=null;
      this.setState({squares:squares});
    }
  }

  updateScore(){ //just guess.
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
  
  renderScoreBoard(currentTurn) { //renders the scoreboard!
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

  renderSquare(c, d, val) { // renders each square! and notifies the square of what to do with events
    return (                // such as a mouse entering or leaving it, or a click being made
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
        onMouseEnter={() => this.isValidMove(c, d, false, this.state.currentTurn,this.state.squares)}
        onMouseLeave={() => this.removeValidMoveIndicator(c, d)}
      />
    );
  }

  renderRow(i) { //render a whole row of squares
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

  render() {  //render the board! and score board :D
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
