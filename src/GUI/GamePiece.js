import React from "react";

export class GamePiece extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      player: this.props.player,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ player: nextProps.player });
  }

  render() {
    return (
      <div className = {this.state.player}>
      </div>
    );
  }
}
