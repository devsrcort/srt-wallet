import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  createAlias,
  setAliasModal,
  setAliasLoading
} from "../redux/settingsAction";
import { errorInput } from "../../errors/redux/errorAction";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";

// COMPONENTS
import Modal from "../../../components/modal";
import BoxConfirm from "./modal/boxConfirm";

// STYLE
import style from "./style.css";

// UTILS
import i18n from "../../../utils/i18n";

class AliasPage extends React.Component {
  constructor() {
    super();

    this.state = {
      fieldAlias: "",
      isEnable: true
    };
  }

  handleAliasValue = value => {
    this.setState({ fieldAlias: value });
    return;
  };

  componentDidMount() {
    let { aliasCreated } = this.props;
    this.setState({ fieldAlias: aliasCreated || "" });
    return;
  }

  createNewAlias = () => {
    let {
      createAlias,
      coins,
      user,
      setAliasLoading,
      errorInput,
      aliasCreated
    } = this.props;
    let { fieldAlias } = this.state;
    let coinName = coins.lunes.abbreviation;
    let coinAddress = coins.lunes.address;
    let price = coins.lunes.price;
    let password = user.password;
    let regex = new RegExp("^[-.0-9@_a-z]+$");

    if (aliasCreated) {
      errorInput("Alias já criado");
      return;
    }

    if (!regex.test(fieldAlias)) {
      errorInput(i18n.t("ALIAS_INFORMED_INCORRECT"));
      return;
    }

    setAliasLoading(true);
    createAlias(coinName, coinAddress, fieldAlias, price, password);
    return;
  };

  renderModalConfirm = () => {
    let { settings, setAliasModal, aliasCreated } = this.props;

    if (aliasCreated) {
      return;
    }

    return (
      <Modal
        title={i18n.t("WALLET_MODAL_RECEIVE_TITLE")}
        content={<BoxConfirm action={() => this.createNewAlias()} />}
        show={settings.wallet.modalAlias}
        close={() => setAliasModal()}
      />
    );
  };

  renderAliases = () => {
    let { aliasCreated, setAliasModal } = this.props;
    let { fieldAlias } = this.state;

    return (
      <Grid container className={style.aliasNameRow}>
        <Grid item xs={12} md={8}>
          <input
            type="text"
            maxLength={"30"}
            disabled={aliasCreated ? true : false}
            className={style.inputClear}
            onChange={event => this.handleAliasValue(event.target.value)}
            value={fieldAlias}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <button className={style.buttonGreen} onClick={() => setAliasModal()}>
            {i18n.t("SET_ALIAS_SAVE_NAME")}
          </button>
        </Grid>
      </Grid>
    );
  };

  render() {
    let { coins } = this.props;

    return (
      <div>
        <div>{this.renderModalConfirm()}</div>
        <div className={style.box}>
          <div className={style.description}>
            <p>{i18n.t("SET_ALIAS_DESCRIPTION")}</p>
            <p>
              {i18n.t("ALIAS_RULES_1")}
              <br />
              {i18n.t("ALIAS_RULES_2")}
            </p>
          </div>
          <Grid container justify="center" spacing={16}>
            <Grid item xs={11} md={2}>
              <Grid container>
                <Grid item xs={4} md={12}>
                  <img
                    src={`images/icons/coins/lunes.png`}
                    className={style.coinIconAlias}
                  />
                </Grid>
                <Grid item xs={6} md={12}>
                  <div className={style.labelCoin}>
                    {i18n.t("SETTINGS_ALIAS_WALLET_LUNES")}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={11} md={7}>
              <input
                type="text"
                disabled
                className={style.inputClearAlias}
                value={
                  coins["lunes"]
                    ? coins["lunes"].address
                    : i18n.t("MESSAGE_NOT_SERVICE")
                }
              />
              <div>
                <Grid container className={style.aliasNameRow}>
                  {this.renderAliases()}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

AliasPage.propTypes = {
  coins: PropTypes.array,
  errorInput: PropTypes.func,
  createAlias: PropTypes.func,
  getAliases: PropTypes.func,
  setAliasLoading: PropTypes.func,
  settings: PropTypes.object,
  user: PropTypes.object,
  aliasCreated: PropTypes.string,
  setAliasModal: PropTypes.func.isRequired
};

const mapSateToProps = store => ({
  coins: store.skeleton.coins,
  settings: store.settings,
  user: store.user.user,
  aliasCreated: store.skeleton.lunesCoin.alias
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setAliasModal,
      createAlias,
      setAliasLoading,
      errorInput
    },
    dispatch
  );

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(AliasPage);
