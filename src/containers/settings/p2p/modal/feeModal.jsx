import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import Loading from "../../../../components/loading";
import ModalBar from "../../../../components/modalBar";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setModalStep } from "../../../p2p/redux/p2pAction";
import { getFeeP2P, setFeeP2P } from "../../redux/settingsAction";
import { clearMessage, errorInput } from "../../../errors/redux/errorAction";

// STYLE
import style from "./style.css";

import i18n from "../../../../utils/i18n";
import ButtonContinue from "../../../../components/buttonContinue";
class FeeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
      feeSelect: 0,
      error: undefined,
      messageError: ""
    };
  }

  calcFee(set) {
    const { setFeeP2P, fee } = this.props;

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

    setFeeP2P(payload);
  }

  validateForm = () => {
    const {
      setModalStep,
      errorInput,
      clearMessage,
      coins,
      signature
    } = this.props;
    const { feeSelect } = this.state;

    let coinBalance = coins["lunes"].balance.available;
    let amount = signature.coinValue + feeSelect;

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
    const { getFeeP2P, coins, signature } = this.props;

    const fromAddress = coins["lunes"].address;
    const decimalPoint = coins["lunes"].decimalPoint;

    getFeeP2P("lunes", fromAddress, signature.coinValue, decimalPoint);
  };

  render() {
    const { loading, p2pPackage, fee, signature } = this.props;
    const { error, messageError, feeSelect } = this.state;

    if (loading) {
      return (
        <div className={style.modalBox}>
          <Loading color="lunes" />
        </div>
      );
    }
    {
      return (
        <div className={style.modalBox}>
          <div>
            {error ? (
              <ModalBar type="error" message={messageError} timer />
            ) : null}
          </div>
          <img
            src={`/images/icons/coins/lunes.png`}
            className={style.modalIconCoin}
            alt={"lunes"}
          />
          <div>
            <span>{i18n.t("P2P_FEE_TEXT_1")}</span>
          </div>

          <div>
            <span className={style.addressConfirm}>
              {signature.coinValue} {i18n.t("P2P_FEE_TEXT_2")}
            </span>
          </div>

          <div>
            <span>{i18n.t("P2P_FEE_TEXT_3")}</span>
          </div>

          <div>
            <span className={style.addressConfirm}>
              {signature.duration} {i18n.t("P2P_FEE_TEXT_4")}
            </span>
          </div>

          <div className={style.confirmFee}>
            <div>
              {i18n.t("PAYMENT_FEE_AMOUNT")}
              <span> {p2pPackage.paycoin} </span> é
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

FeeModal.propTypes = {
  setFeeP2P: PropTypes.func.isRequired,
  setModalStep: PropTypes.func.isRequired,
  signature: PropTypes.object,
  fee: PropTypes.object,
  user: PropTypes.object,
  loading: PropTypes.bool,
  coins: PropTypes.array,
  getFeeP2P: PropTypes.func,
  p2pPackage: PropTypes.object,
  errorInput: PropTypes.func,
  clearMessage: PropTypes.func
};

const mapStateToProps = store => ({
  signature: store.settings.signature,
  user: store.user.user,
  coins: store.skeleton.coins,
  p2p: store.skeleton,
  fee: store.settings.fee,
  address: store.settings.address,
  loading: store.settings.loading,
  p2pPackage: store.settings.p2pPackage
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setModalStep,
      getFeeP2P,
      setFeeP2P,
      clearMessage,
      errorInput
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeeModal);
