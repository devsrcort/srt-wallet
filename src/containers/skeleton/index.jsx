import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Header from "./header";
import Menu from "./menu";
import P2P from "../p2p/index";
import Grid from "@material-ui/core/Grid";
import style from "./style.css";
import { clearUserData } from "../user/redux/userAction";
import { clearAll, getDefinitionMetadata } from "../../utils/localStorage";
import { bindActionCreators } from "redux";

class Skeleton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openMenu: false, openP2PComponent: false };
  }

  toggleMenu = () => {
    this.setState({ ...this.state, openMenu: !this.state.openMenu });
  };

  toggleP2PComponent = () => {
    return this.setState({ openP2PComponent: !this.state.openP2PComponent });
  };

  logout = () => {
    const { clearUserData } = this.props;
    let deleteMeta = JSON.parse(getDefinitionMetadata());

    if (deleteMeta === true || deleteMeta == null) {
      clearAll();
    }

    clearUserData();
  };

  render() {
    const { children } = this.props;
    const { openMenu } = this.state;
    return (
      <div>
        <Header actionMenu={this.toggleMenu} actionLogout={this.logout} />
        <Grid container>
          <Grid item md={2} xl={1}>
            <Menu
              openMenu={openMenu}
              actionMenu={this.toggleMenu}
              actionLogout={this.logout}
              actionP2PComponent={this.toggleP2PComponent}
            />
          </Grid>

          <Grid item xs={12} lg={10} xl={11}>
            <div className={style.colContainer}>{children}</div>
          </Grid>
          {this.state.openP2PComponent && <P2P />}
        </Grid>
      </div>
    );
  }
}

Skeleton.propTypes = {
  children: PropTypes.element.isRequired,
  clearUserData: PropTypes.func
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearUserData
    },
    dispatch
  );

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Skeleton)
);
