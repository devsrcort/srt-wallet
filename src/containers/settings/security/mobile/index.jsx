import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// STYLE
import style from "../../style.css";
import colors from "../../../../components/bases/colors";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

// UTILS
import i18n from "../../../../utils/i18n";

// COMPONENTS
import { PhoneMask } from "../../../../components/inputMask";

const inputStyle = {
  inputMobile: {
    color: colors.messages.info,
    margin: "0",
    padding: "5px",
    fontSize: "18px",
    width: "96%",
    "&:hover:before": {
      borderBottomColor: colors.purple.clear
    }
  },
  root: {
    color: colors.messages.info,
    margin: "0",
    padding: "5px",
    fontSize: "32px",
    width: "calc(100% - 50px)",
    "&:hover:before": {
      borderBottomColor: colors.purple.clear
    }
  },
  cssInput: {
    fontFamily: "Noto Sans, sans-serif",
    letterSpacing: "0.5px",
    textAlign: "center"
  },
  cssUnderline: {
    "&:before, &:after": {
      borderBottomColor: colors.purple.clear
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottomColor: `${colors.purple.clear} !important`
    }
  },
  disabled: {},
  error: {},
  focused: {}
};
class MobileAuthenticator extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: "",
      enableButton: false
    };
  }

  handlePhoneChange = event => {
    let phoneValue = event.value.replace(" ", "");
    phoneValue.length === 11
      ? this.setState({
          enableButton: true,
          phone: phoneValue
        })
      : this.setState({
          enableButton: false,
          phone: phoneValue
        });
  };

  sendData = () => {
    alert("ok");
  };

  render() {
    const { classes } = this.props;
    const { enableButton } = this.state;
    return (
      <div>
        <Grid container className={style.containerHeaderSettings}>
          <Grid item xs={12} className={style.headerSettingsDefault}>
            <Hidden smUp>
              <Grid item xs={12}>
                <h3>{i18n.t("TITLE_SECURITY_2")} </h3>
              </Grid>
            </Hidden>
            <Grid item sm={2} />

            <Grid item xs={6} sm={2}>
              <Link to="security">
                <p>{i18n.t("SECURITY_LINK_RETURN")}</p>
              </Link>
            </Grid>
            <Hidden xsDown>
              <Grid item xs={12} sm={3}>
                <h3>{i18n.t("TITLE_SECURITY_2")}</h3>
              </Grid>
            </Hidden>

            <Grid item xs={10} sm={6} id={"hr"}>
              <hr />
            </Grid>
          </Grid>
        </Grid>

        <div className={style.containerSecurity}>
          <Grid item xs={11} sm={8}>
            <Grid container className={style.allSecurity}>
              <Grid item xs={12} className={style.containerItems}>
                <Grid item xs={12} className={style.counterItemsMobile}>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemMobile}>
                      {"1"} <p>{i18n.t("SECURITY_ITEM_1")}</p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemMobile}>
                      {"2"} <p> {i18n.t("SECURITY_ITEM_2")} </p>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemMobile}>
                      {"3"} <p>{i18n.t("SECURITY_ITEM_3")}</p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={style.contentMobile}>
                <h3>{i18n.t("SECURITY_INSERT_PHONE")}</h3>
                <Grid container className={style.alignNumberField}>
                  <Grid item xs={12} sm={9} className={style.fontSizeInput}>
                    <Hidden smUp>
                      <Grid item xs={12}>
                        <Input
                          classes={{
                            root: classes.inputMobile,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                          name="phone"
                          width={"100%"}
                          inputComponent={PhoneMask}
                          onChange={event =>
                            this.handlePhoneChange(event.target)
                          }
                          value={this.phone}
                        />
                      </Grid>
                    </Hidden>
                    <Grid item sm={2} />

                    <Hidden xsDown>
                      <Input
                        classes={{
                          root: classes.root,
                          underline: classes.cssUnderline,
                          input: classes.cssInput
                        }}
                        name="phone"
                        width={"100%"}
                        inputComponent={PhoneMask}
                        onChange={event => this.handlePhoneChange(event.target)}
                        value={this.phone}
                      />
                    </Hidden>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.alignButtonMobile}>
                    {enableButton ? (
                      <button
                        className={style.buttonEnableSecurity}
                        onClick={() => this.sendData()}
                      >
                        {i18n.t("BTN_SUBMIT")}
                      </button>
                    ) : (
                      <button
                        disabled
                        className={style.buttonDisabledSecurity}
                        onClick={() => this.sendData()}
                      >
                        {i18n.t("BTN_SUBMIT")}
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

MobileAuthenticator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(inputStyle)(MobileAuthenticator);
