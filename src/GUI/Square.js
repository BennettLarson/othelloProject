import React from "react";
import { GamePiece } from "./GamePiece";
export class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value});
  }

  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()} onMouseLeave={() => this.props.onMouseLeave()} onMouseEnter={() => this.props.onMouseEnter()}>
        {this.state.value}
      </button>
    );
  }
}

// onMouseLeave={() => this.props.onMouseLeave()} onMouseEnter={() => this.props.onMouseEnter()}>
