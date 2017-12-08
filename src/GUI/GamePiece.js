import React from "react";

export class GamePiece extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      player: this.props.player,
      value: this.props.value
    };
  }

  render() {
    return (
      <div className = {this.state.player}>
      </div>
    );
  }
}
