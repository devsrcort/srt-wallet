import path from "path";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import React, { Component } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

// REDUX
import { connect } from "react-redux";

// COMPONENTS
import fakeDelay from "../../../components/fakeDelay";
import Loading from "../../../components/loading";
import Skeleton from "../../skeleton";
import ModalBar from "../../../components/modalBar";

function loading({ error }) {
  if (error) {
    console.warn(error);
    return "Error!";
  } else {
    return <Loading color="wallet" height="80vh" width="100px" />;
  }
}

/* eslint-disable */
let home = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../home")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../home")
});

let wallet = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../wallet")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../wallet")
});

let leasing = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../leasing")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../leasing")
});

let coupons = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../coupons")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../coupons")
});

let settings = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings")
});

let user = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/user")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/user")
});

let security = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/security")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/security")
});

let twoFactoryAuthenticate = Loadable({
  loader: () =>
    fakeDelay(400).then(() => import("../../settings/security/2FA")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/security/2FA")
});

let mobileAuthenticator = Loadable({
  loader: () =>
    fakeDelay(400).then(() => import("../../settings/security/mobile")),
  loading: loading,
  serverSideRequirePath: path.resolve(
    __dirname,
    "../../settings/security/mobile"
  )
});

let KYC = Loadable({
  loader: () =>
    fakeDelay(400).then(() => import("../../settings/security/KYC")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/security/KYC")
});

let walletSettings = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/wallet")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/wallet")
});

let definitions = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/definitions")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/definitions")
});

let consent = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/consent")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/consent")
});

let invoices = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../payment")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../payment")
});

let recharge = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../recharge")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../recharge")
});
let errorNotFound = Loadable({
  loader: () => fakeDelay(0).then(() => import("../../errors/404")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../errors/404")
});

let errorInternal = Loadable({
  loader: () => fakeDelay(0).then(() => import("../../errors/500")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../errors/500")
});

let assets = Loadable({
  loader: () => fakeDelay(0).then(() => import("../../assets")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../assets")
});

let p2pSettings = Loadable({
  loader: () => fakeDelay(400).then(() => import("../../settings/p2p")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../settings/p2p")
});

let buycoin = Loadable({
  loader: () => fakeDelay(0).then(() => import("../../buycoin")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../buycoin")
});

let invite = Loadable({
  loader: () => fakeDelay(0).then(() => import("../../invite")),
  loading: loading,
  serverSideRequirePath: path.resolve(__dirname, "../../invite")
});
/* eslint-enable */

class App extends Component {
  render() {
    const { error } = this.props;
    return (
      <Router>
        <div>
          <div>
            {error.active ? (
              <ModalBar type={error.type} message={error.message} timer />
            ) : null}
          </div>
          <Skeleton>
            <Switch>
              {/* INSIDE ROUTES */}
              <Route exact path="/" component={home} />
              <Route path="/home" component={home} />
              <Route path="/wallet" component={wallet} />
              <Route path="/coupons" component={coupons} />
              <Route path="/leasing" component={leasing} />
              <Route path="/settings" component={settings} />
              <Route path="/user" component={user} />
              <Route path="/security" component={security} />
              <Route path="/wallet-settings" component={walletSettings} />
              <Route path="/definitions" component={definitions} />
              <Route path="/consent" component={consent} />

              <Route path="/invoices" component={invoices} />
              <Route path="/recharge" component={recharge} />
              <Route path="/assets" component={assets} />
              <Route
                path="/twoFactoryAuthenticate"
                component={twoFactoryAuthenticate}
              />
              <Route
                path="/mobileAuthenticator"
                component={mobileAuthenticator}
              />
              <Route path="/KYC" component={KYC} />

              <Route path="/setp2p" component={p2pSettings} />
              <Route path="/coinsale" component={buycoin} />
              <Route path="/invite" component={invite} />

              {/* ERRORS PAGE */}
              <Route path="/404" component={errorNotFound} />
              <Route path="/500" component={errorInternal} />
              <Route path={"**"} component={errorNotFound} />
            </Switch>
          </Skeleton>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  error: PropTypes.object
};

const mapSateToProps = store => ({
  error: store.error.message
});

export default connect(mapSateToProps)(App);
