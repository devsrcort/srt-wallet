import React from "react";
import PropTypes from "prop-types";

//  REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setModalStep } from "../../../p2p/redux/p2pAction";
import { signSignature } from "../../redux/settingsAction";
import { errorInput } from "../../../errors/redux/errorAction";

// UTILS
import { encryptHmacSha512Key } from "../../../../utils/cryptography";

import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

// COMPONENTS
import ButtonContinue from "../../../../components/buttonContinue";

class SecureBuy extends React.Component {
  constructor() {
    super();
    this.state = {
      password: ""
    };
  }

  setPassword = password => {
    this.setState({ ...this.state, password });
  };

  confirmPassword = () => {
    let { password } = this.state;
    let {
      user,
      errorInput,
      signSignature,
      coins,
      p2pPackage,
      signature
    } = this.props;

    const coin = "lunes";

    const payload = {
      planId: signature.id,
      coin: coin,
      fromAddress: coins[coin].address,
      lunesUserAddress: coins[coin].address,
      amount: signature.coinValue,
      fee: p2pPackage.fee.fee.fee,
      feePerByte: p2pPackage.fee.fee.feePerByte,
      feeLunes: p2pPackage.fee.fee.feeLunes,
      price: coins[coin].price,
      decimalPoint: coins[coin].decimalPoint,
      user: user.password
    };

    if (user.password === encryptHmacSha512Key(password)) {
      signSignature(payload);
      return;
    }

    errorInput(i18n.t("MESSAGE_INVALID_PASSWORD"));

    return;
  };

  render() {
    let { password } = this.state;
    let { loading } = this.props;

    return (
      <div className={style.modalBox}>
        <img
          src="/images/icons/privacy/privacy.png"
          className={style.modalIconCoin}
        />
        <div>
          <span>{i18n.t("P2P_CONFIRM_PASSWORD_SIGNATURE")}</span>
          <span className={style.addressConfirm}>
            {i18n.t("P2P_CONFIRM_SIGNATURE")}
          </span>
        </div>

        <div className={style.confirmFee}>
          <input
            type="password"
            name="txtpass"
            placeholder="*********"
            aria-label="password"
            alt="password"
            onChange={event => this.setPassword(event.target.value)}
            value={password}
            className={style.inputTextDefault}
          />
        </div>

        <ButtonContinue
          label={i18n.t("BTN_CONFIRM")}
          action={() => this.confirmPassword()}
          loading={loading}
        />
      </div>
    );
  }
}

SecureBuy.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  errorInput: PropTypes.func.isRequired,
  coins: PropTypes.array.isRequired,
  setModalStep: PropTypes.func.isRequired,
  signSignature: PropTypes.func,
  p2pPackage: PropTypes.object,
  signature: PropTypes.object
};

const mapStateToProps = store => ({
  p2pPackage: store.settings.p2pPackage,
  loading: store.settings.loading,
  user: store.user.user,
  coins: store.skeleton.coins,
  signature: store.settings.signature
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setModalStep,
      signSignature,
      errorInput
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecureBuy);
