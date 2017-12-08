import React from "react";
import { render } from "react-dom";
import { Board } from "./GUI/Board";

class App extends React.Component {
  render() {
    return (
      <div>
        <Board p1InitialScore="0" p2InitialScore="0" initialTurn='w'/> 
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
