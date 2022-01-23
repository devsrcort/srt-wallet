import React from "react";
import PropTypes from "prop-types";

// MATERIAL
import { Star } from "@material-ui/icons";

// STYLE
import style from "./style.css";

class StarVotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.votes || 0
    };
  }
  mouseOver = val => {
    this.setState({
      value: val || 0
    });
  };

  clicked = val => {
    const { selectVote } = this.props;
    selectVote(val);
  };
  renderStar = () => {
    const { enable, votes } = this.props;
    const { value } = this.state;
    if (enable) {
      return [1, 2, 3, 4, 5].map(val => {
        let type = val <= value ? style.starActiveRating : style.starRating;
        return (
          <Star
            key={val}
            onMouseOver={() => this.mouseOver(val)}
            onMouseMove={() => this.mouseOver(val)}
            onMouseLeave={() => this.mouseOver(votes)}
            onClick={() => this.clicked(val)}
            className={type}
          />
        );
      });
    }
    return [1, 2, 3, 4, 5].map(val => {
      let type = val <= votes ? style.starActive : style.star;
      return <Star key={val} className={type} />;
    });
  };
  render() {
    return <div className={style.boxStar}>{this.renderStar()}</div>;
  }
}

StarVotes.propTypes = {
  votes: PropTypes.number,
  selectVote: PropTypes.func,
  enable: PropTypes.any
};

export default StarVotes;
