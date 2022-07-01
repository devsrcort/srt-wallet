import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setWalletSendModalOpen,
  setWalletModalStep,
  setWalletLoading,
  resetModalSend,
} from "./redux/walletAction";
import { errorRequest } from "../errors/redux/errorAction.js";

import { loadWalletInfo } from "../skeleton/redux/skeletonAction";

// STYLE
import style from "./style.css";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";

//COMPONENTS
import Modal from "../../components/modal";
import SendModal from "./modal/sendModal/";

// UTILS
import i18n from "../../utils/i18n";

class CoinsInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      modalSend: false,
      modalReceive: false,
    };
  }

  previousStep = () => {
    let { step } = this.props.wallet.modal;
    let { setWalletModalStep } = this.props;
    if (step >= 0) {
      setWalletModalStep(step - 1);
    }

    return;
  };

  renderArrowPercent = (val) => {
    if (parseFloat(val) < 0) {
      return <ArrowDropDown className={style.arrowPercentDown} />;
    } else {
      return <ArrowDropUp className={style.arrowPercentUp} />;
    }
  };
  handleSendModalOpen = () => {
    let { wallet, errorRequest, setWalletSendModalOpen } = this.props;
    let utxos = !wallet.utxos ? {} : wallet.utxos;
    if (utxos.status === "error") {
      errorRequest(utxos.message);
      return;
    }
    setWalletSendModalOpen();
  };

  componentDidUpdate() {
    let { lastCoin } = this.state;
    let { wallet } = this.props;
    // let address = coins[wallet.selectedCoin].address;
    if (lastCoin !== wallet.selectedCoin) {
      this.setState({ lastCoin: wallet.selectedCoin });
    }
  }

  handleModalSendClose = () => {
    this.props.resetModalSend();
    let {
      user,
      wallet,
      setWalletSendModalOpen,
      setWalletLoading,
      loadWalletInfo,
    } = this.props;
    let step = wallet.modal.step;

    if (step === 4) {
      return null;
    } else if (step === 5 || step === 6) {
      return () => {
        setWalletSendModalOpen(),
          setWalletLoading(true),
          loadWalletInfo(user.password);
      };
    } else {
      return () => setWalletSendModalOpen();
    }
  };

  render() {
    let { setWalletSendModalOpen, user, coins, wallet } = this.props;
    let step = wallet.modal.step;
    let selectedCoin = wallet.selectedCoin ? wallet.selectedCoin : "SRT";

    if (!coins[selectedCoin]) return null;

    let coin = coins[wallet.selectedCoin];
    let balance = coin.balance.available;
    let strBalance = parseInt(balance).toLocaleString();
    let curTokenPrice = parseFloat(coin.price).toFixed(2);
    let curTotalPrice = coin.totalPrice.toFixed(2).toLocaleString();
    let userName = user.name;
    let address = coin.address;
    return (
      <div align="center">
        <Modal
          title={i18n.t("WALLET_MODAL_SEND_TITLE")}
          content={<SendModal />}
          show={wallet.modal.open}
          close={this.handleModalSendClose}
          back={
            step === 0 || step === 4 || step === 5 || step === 6
              ? null
              : () => this.previousStep()
          }
        />

        <Grid container className={style.containerInfoBackground}>
          <Grid item className={style.coinInfoBox}>
            <Grid item className={style.coinSymbolBox}>
              <img src={"./images/icons/coins/" + coin.abbreviation + ".png"} />
              <h4> $ {curTokenPrice}</h4>
            </Grid>

            <Grid item>
              <Grid item className={style.balanceItem}>
                <div className={style.alignValuesFlex}>
                  <h4>{i18n.t("HELLO")},</h4>
                  <h4> {userName}</h4>
                  <img src={"./images/icons/general/setting@1x.png"} width="24" height="24"/>
                </div>

                <div className={style.alignValues}>
                  <hr />
                  <h4>{i18n.t("WALLET_BALANCE")}</h4>
                  <h4>{strBalance} </h4>
                  <hr />
                  <h4>USD</h4>
                  <h4> $ {curTotalPrice}</h4>
                  <hr />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={style.balanceItemMobile}>
            <div className={style.alignButtonsBetween}>
              <h3>{i18n.t("SETTINGS_USER_ADDRESS")}</h3>
              <img src={"./images/icons/general/copy@1.png"} />
            </div>
            <div className={style.addressValue}>
              <h4>{address}</h4>
              <hr />
            </div>
            <h3>{i18n.t("WITHDRAWABLE_RATE")}</h3>
            <h4>0 %</h4>
            <hr />
            <h3>{i18n.t("EXPECTED_WITHDRAWAL_DATE")}</h3>
            <h4>D- </h4>
            <hr />
          </Grid>
        </Grid>
        <button
          className={style.sentButton}
          onClick={() => alert(i18n.t("LOCKED_WALLET"))}
          // onClick={() => setWalletSendModalOpen()}
          >
          {i18n.t("BTN_SEND")}
        </button>
      </div>
    );
  }
}

CoinsInfo.propTypes = {
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  coins: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  loadWalletInfo: PropTypes.func.isRequired,
  setWalletLoading: PropTypes.func.isRequired,
  setWalletModalStep: PropTypes.func.isRequired,
  setWalletSendModalOpen: PropTypes.func.isRequired,
  errorRequest: PropTypes.func,
  resetModalSend: PropTypes.func,
};

const mapSateToProps = (store) => ({
  user: store.user.user,
  wallet: store.wallet,
  coins: store.skeleton.coins,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadWalletInfo,
      setWalletLoading,
      setWalletModalStep,
      setWalletSendModalOpen,
      errorRequest,
      resetModalSend,
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(CoinsInfo);
