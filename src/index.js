import React from "react";
import { render } from "react-dom";
import { Board } from "./GUI/Board";

class App extends React.Component {
  render() {
    return (
      <div>
        <Board p1InitialScore="2" p2InitialScore="2" computerPlayerActive={true}/> 
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
