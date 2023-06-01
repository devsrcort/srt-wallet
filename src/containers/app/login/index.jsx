import path from "path";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

// REDUX
import React, { Component } from "react";
import { connect } from "react-redux";

// COMPONENTS
import Loading from "../../../components/loading";
import fakeDelay from "../../../components/fakeDelay";
import ModalBar from "../../../components/modalBar";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";

// STYLE
import style from "../style.css";

function Transition({ error }) {
  if (error) {
    console.warn(error);
    return "Error!";
  } else {
    return <Loading color="SRT" width="35px" />;
  }
}

/* eslint-disable */
let parking = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../parking/notification")),
  loading: Transition,
  serverSideRequirePath: path.resolve(__dirname, "../../parking/notification")
});

let errorNotFound = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../errors/404")),
  loading: Transition,
  serverSideRequirePath: path.resolve(__dirname, "../../errors/404")
});

let errorInternal = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../errors/500")),
  loading: Transition,
  serverSideRequirePath: path.resolve(__dirname, "../../errors/500")
});

/* eslint-enable */

class Login extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: false
    };
  }

  componentDidMount() {
    this.newPasswordAuth();
  }

  newPasswordAuth = () => {
    let newPassword = true;
    if (newPassword) {
      this.setState({ newPassword: true });
    }

    return;
  };

  render() {
    const { error } = this.props;

    return (
      <Router>
        <div>
          <Grid container>
          <div>
              {error.active ? (
                <ModalBar type={error.type} message={error.message} timer />
              ) : null}
            </div>
            <Grid item xs={12} sm={12} md={5} className={style.colLeft}>
              <Switch>
                {/* INSIDE ROUTES */}
                <Route exact path="/" component={parking} />
                <Route path="/404" component={errorNotFound} />
                <Route path="/500" component={errorInternal} />
                <Route path={"**"} component={parking} />
              </Switch>
            </Grid>

            <Hidden smDown>
              <Grid item md={7} className={style.colRight}>
              </Grid>
            </Hidden>
          </Grid>
        </div>
      </Router>
    );
  }
}

Login.propTypes = {
  error: PropTypes.object
};

const mapSateToProps = store => ({
  error: store.error.message
});

export default connect(mapSateToProps)(Login);