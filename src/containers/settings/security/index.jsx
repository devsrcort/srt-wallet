import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTwoFactorAuth } from "../redux/settingsAction";

// STYLE
import style from "../style.css";
import Grid from "@material-ui/core/Grid";
import i18n from "../../../utils/i18n";

class Security extends React.Component {
  render() {
    return (
      <div>
        <Grid container className={style.containerHeaderSettings}>
          <Grid item xs={11} sm={12} className={style.headerSettingsDefault}>
            <Grid item xs={4} sm={2}>
              <Link to="/settings">
                <p>{i18n.t("SETTING_LINK_RETURN")}</p>
              </Link>
            </Grid>

            <Grid item xs={10} sm={10} id={"hr"}>
              <hr />
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={style.containerSettings}>
          <Grid item xs={10} sm={11} className={style.headerSettings}>
            <h2>{i18n.t("SETTINGS_TITLE")}</h2>
            <p>{i18n.t("SETTINGS_HEADER_INFO")}</p>
          </Grid>

          <Grid container className={style.containerCardsSettings}>
            <Grid item xs={12} sm={3} className={style.cardsSettings}>
              <Link to="/TwoFactoryAuthenticate">
                <Grid className={style.cards}>{i18n.t("CARD_SECURITY_1")}</Grid>
              </Link>
            </Grid>

            {/* <Grid item xs={12} sm={3} className={style.cardsSettings}>
              <Link to="/MobileAuthenticator">
                <Grid className={style.cards}>{i18n.t("CARD_SECURITY_2")}</Grid>
              </Link>
            </Grid> */}

            <Grid item xs={12} sm={3} className={style.cardsSettings}>
              <Link to="/KYC">
                <Grid className={style.cards}>{i18n.t("CARD_SECURITY_3")}</Grid>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Security.propTypes = {
  twoFactor: PropTypes.bool,
  getTwoFactorAuth: PropTypes.func,
  settings: PropTypes.object
};

const mapStateToProps = store => ({
  twoFactor: store.user.twoFactor,
  settings: store.settings
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTwoFactorAuth
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Security));
