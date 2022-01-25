import React from "react";
import PropTypes from "prop-types";

// MATERIAL
import { withStyles } from "@material-ui/core/styles";

// STYLES
import style from "./style.css";

const styles = {
  fontSmall: {
    fontSize: "27.5px"
  },
  fontMedium: {
    fontSize: "55px"
  },
  fontLarge: {
    fontSize: "72.5px"
  }
};

class LogoLunes extends React.Component {
  render() {
    const { small, medium, large, classes } = this.props;
    return (
      <div className={style.logoLunes}>
        <div
          className={
            small
              ? classes.fontSmall
              : medium
                ? classes.fontMedium
                : large
                  ? classes.fontLarge
                  : classes.fontSmall
          }
        >
          <span>
            S
            <span>R</span>T
          </span>
        </div>
      </div>
    );
  }
}

LogoLunes.propTypes = {
  classes: PropTypes.object.isRequired,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool
};

export default withStyles(styles)(LogoLunes);
