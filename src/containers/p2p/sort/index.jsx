import React from "react";
import PropTypes from "prop-types";

// STYLES
import style from "./style.css";

import { FormControlLabel, Radio, Grid } from "@material-ui/core";
import { Lens } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

// UTILS
import i18n from "../../../utils/i18n";

const stylesCustom = {
  root: {
    color: "#654fa4",
    "&$checked": {
      color: "#68f285"
    }
  },
  rootLabel: {
    fontSize: "11px",
    color: "#fff"
  },
  checked: {
    color: "#68f285"
  }
};

class Sort extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedValue: ""
    };
  }

  handleChange = event => {
    let { that } = this.props;
    this.setState({
      ...this.state,
      selectedValue: event.target.value
    });
    // that refers to the class Orders
    that.setState({ typeOfSort: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid className={style.boxSort}>
          <p className={style.title}>{i18n.t("P2P_SORT_TITLE")}</p>
          <FormControlLabel
            value="ascending"
            className={style.labelRadio}
            classes={{ label: classes.rootLabel }}
            control={
              <Radio
                checked={this.state.selectedValue === "ascending"}
                icon={<Lens />}
                checkedIcon={<Lens />}
                onChange={this.handleChange}
                classes={{ root: classes.root, checked: classes.checked }}
              />
            }
            label={i18n.t("P2P_SORT_ASCENDING")}
            labelPlacement="end"
          />
          <FormControlLabel
            value="descending"
            className={style.labelRadio}
            classes={{ label: classes.rootLabel }}
            control={
              <Radio
                checked={this.state.selectedValue === "descending"}
                icon={<Lens />}
                checkedIcon={<Lens />}
                onChange={this.handleChange}
                classes={{ root: classes.root, checked: classes.checked }}
              />
            }
            label={i18n.t("P2P_SORT_DESCENDING")}
            labelPlacement="end"
          />

          <FormControlLabel
            value="newest"
            className={style.labelRadio}
            classes={{ label: classes.rootLabel }}
            control={
              <Radio
                checked={this.state.selectedValue === "newest"}
                icon={<Lens />}
                checkedIcon={<Lens />}
                onChange={this.handleChange}
                classes={{ root: classes.root, checked: classes.checked }}
              />
            }
            label={i18n.t("P2P_SORT_NEWEST")}
            labelPlacement="end"
          />

          <FormControlLabel
            value="oldest"
            className={style.labelRadio}
            classes={{ label: classes.rootLabel }}
            control={
              <Radio
                checked={this.state.selectedValue === "oldest"}
                icon={<Lens />}
                checkedIcon={<Lens />}
                onChange={this.handleChange}
                classes={{ root: classes.root, checked: classes.checked }}
              />
            }
            label={i18n.t("P2P_SORT_OLDEST")}
            labelPlacement="end"
          />
        </Grid>
      </div>
    );
  }
}

Sort.propTypes = {
  classes: PropTypes.object,
  that: PropTypes.object.isRequired
};

export default withStyles(stylesCustom)(Sort);
