import React from "react";

// STYLE
import style from "./style.css";

class BoxChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myId: undefined
    };
  }

  render() {
    return (
      <div className={style.boxChat}>
      </div>
    );
  }
}

BoxChat.propTypes = {};

export default BoxChat;
