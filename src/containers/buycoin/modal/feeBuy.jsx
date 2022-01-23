import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getFeeBuy, setFeeBuy, setModalStep } from "../redux/buyAction";
import { clearMessage, errorInput } from "../../errors/redux/errorAction";

//COMPONENTS
import ButtonContinue from "../../../components/buttonContinue";
import ModalBar from "../../../components/modalBar";
import Loading from "../../../components/loading";

//UTILS
import i18n from "../../../utils/i18n";

// STYLE
import style from "./style.css";

class FeeBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeSelect: 0,
      error: undefined,
      messageError: ""
    };
  }

  calcFee(set) {
    const { setFeeBuy, fee } = this.props;

    let feeValue = 0;
    let feePerByte = 0;
    let feeLunes = 0;

    switch (set) {
      case "low":
        feeValue = fee.fee.low;
        feePerByte = fee.feePerByte.low;
        feeLunes = fee.feeLunes.low;
        break;
      case "medium":
        feeValue = fee.fee.medium;
        feePerByte = fee.feePerByte.medium;
        feeLunes = fee.feeLunes.medium;
        break;
      case "high":
        feeValue = fee.fee.high;
        feePerByte = fee.feePerByte.high;
        feeLunes = fee.feeLunes.high;
        break;
    }

    this.setState({ feeSelect: feeValue });

    const payload = {
      fee: feeValue,
      feePerByte: feePerByte,
      feeLunes: feeLunes
    };

    setFeeBuy(payload);
  }

  validateForm = () => {
    const {
      setModalStep,
      errorInput,
      clearMessage,
      coins,
      buypack
    } = this.props;
    const { feeSelect } = this.state;

    let coinBalance = coins[buypack.paycoin].balance.available;
    let amount = buypack.amountPay + feeSelect;

    if (feeSelect > 0) {
      if (parseFloat(amount) <= coinBalance) {
        setModalStep(2);
      } else {
        errorInput(i18n.t("PAYMENT_AMOUNT_ERROR"));
        return;
      }
    } else {
      errorInput(i18n.t("MESSAGE_SELECT_FEE"));
      return;
    }
    clearMessage();
  };

  componentDidMount = () => {
    const { getFeeBuy, buypack, wallet } = this.props;

    const fromAddress = wallet.coins[buypack.paycoin].address;
    const toAddress = buypack.address;
    const decimalPoint = wallet.coins[buypack.paycoin].decimalPoint;
    
    getFeeBuy(buypack.paycoin, buypack.amountPay, fromAddress, toAddress, decimalPoint);
  };

  render() {
    const { loading, buypack, fee } = this.props;
    const { error, messageError, feeSelect } = this.state;

    if (loading) {
      return (
        <div className={style.modalBox}>
          <Loading color="lunes" />
        </div>
      );
    } else {
      return (
        <div className={style.modalBox}>
          <div>
            {error ? (
              <ModalBar type="error" message={messageError} timer />
            ) : null}
          </div>
          <img
            src={`/images/icons/coins/${buypack.paycoin}.png`}
            className={style.modalIconCoin}
          />
          <div>
            <span>{i18n.t("COINSALE_FEE_TEXT_1")}</span>
            <span className={style.totalConfirm}>
              {buypack.amountPay.toFixed(8)} {buypack.paycoin.toUpperCase()}
            </span>
          </div>
          <div>
            <span>{i18n.t("COINSALE_FEE_TEXT_2")}</span>
            <span className={style.addressConfirm}>
              {i18n.t("COINSALE_TITLE")}
            </span>
          </div>

          <div className={style.confirmFee}>
            <div>
              {i18n.t("PAYMENT_FEE_AMOUNT")}
              <span> {buypack.paycoin} </span> é
            </div>
            <div className={style.txtamount}>{feeSelect}</div>
          </div>

          <div className={style.boxFee}>
            <span
              className={style.greenLabelFee}
              onClick={() => this.calcFee("low")}
            >
              {i18n.t("FEE_LOW")} {fee.fee.low}
            </span>
            <span
              className={style.yellowLabelFee}
              onClick={() => this.calcFee("medium")}
            >
              {i18n.t("FEE_MEDIUM")} {fee.fee.medium}
            </span>
            <span
              className={style.redLabelFee}
              onClick={() => this.calcFee("high")}
            >
              {i18n.t("FEE_HIGH")} {fee.fee.high}
            </span>
          </div>

          <ButtonContinue
            label={i18n.t("BTN_CONTINUE")}
            action={() => this.validateForm()}
            loading={loading}
          />
        </div>
      );
    }
  }
}

FeeBuy.propTypes = {
  setFeeBuy: PropTypes.func.isRequired,
  getFeeBuy: PropTypes.func.isRequired,
  setModalStep: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  errorInput: PropTypes.func.isRequired,
  fee: PropTypes.object.isRequired,
  buypack: PropTypes.object.isRequired,
  wallet: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  coins: PropTypes.array.isRequired
};

const mapStateToProps = store => ({
  buypack: store.buy.buypackage,
  wallet: store.skeleton,
  loading: store.buy.loading,
  fee: store.buy.fee,
  price: store.skeleton.coins,
  coins: store.buy.coinsBuy
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFeeBuy,
      setFeeBuy,
      setModalStep,
      clearMessage,
      errorInput
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeeBuy);
