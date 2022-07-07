import React from "react";
import BoxQrReader from "./boxQrReader";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setWalletSendModalLoading,
  setWalletTransaction,
} from "../../redux/walletAction";

// MATERIAL UI
import Hidden from "@material-ui/core/Hidden";

// COMPONENTS
import ButtonSend from "./buttonSend.jsx";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "../../style.css";

class SendBox extends React.Component {
  constructor() {
    super();
    this.state = { address: "", isVisible: false, amount: 0 };
  }

  changeAddress = (address) => this.setState({ address });

  changeAmount = (amount) => this.setState({ amount });

  sendToken = () => {
    let { coin, user, modal, coins, setWalletTransaction } = this.props;
    let { address, amount} = this.state;
    setWalletTransaction(
      {
        fromAddress: coins[coin].address,
        toAddress: address,
        amount: amount,
        fee: user.transferFee,
      },
    );
  };

  validateAddress = () => {
    setWalletSendModalLoading();
    return;
  };

  validateSms = () => {
    setWalletSendModalLoading();
    return;
  };

  handleQrCodeReader = () => {
    let { address, amount } = this.state;
    let { coin, modal, user } = this.props;
    const fee = user.transferFee;

    return (
      <div>
        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("MODAL_SEND_ADDRESS")}</h4>
          </div>
          <input
            type="text"
            name="txtaddress"
            value={address}
            onChange={(event) => this.changeAddress(event.target.value)}
            className={style.inputClear}
          />
          <hr />
        </div>

        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("TRANSFER_AMOUNT")}</h4>
          </div>
          <input
            type="text"
            name="txtamount"
            value={amount}
            onChange={(event) => this.changeAmount(event.target.value)}
            className={style.inputClearAmount}
          />
          <p>{i18n.t("TRANSFER_AVAILABLE_AMOUNT")}: 0 SRT</p>
          <hr />
        </div>

        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("TRANSFER_FEE")}</h4>
          </div>
          <h4> {fee} SRT</h4>
          <hr />
        </div>
        <div className={style.modalBoxSubContainer}>
          <ButtonSend
            // action={() => alert(i18n.t("LOCKED_WALLET"))}
            action={() => this.sendToken()}
            loading={modal.loading}
          />
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.handleQrCodeReader()}</div>;
  }
}

SendBox.propTypes = {
  coin: PropTypes.string.isRequired,
  coins: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  modal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setWalletSendModalLoading: PropTypes.func.isRequired,
  setWalletTransaction: PropTypes.func.isRequired
};

const mapSateToProps = (store) => ({
  user: store.user.user,
  modal: store.wallet.modal,
  coins: store.skeleton.coins
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setWalletSendModalLoading,
      setWalletTransaction
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(SendBox);
