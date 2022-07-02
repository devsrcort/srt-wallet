import React from "react";
import BoxQrReader from "./boxQrReader";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setWalletSendModalLoading } from "../../redux/walletAction";

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
    this.state = { address: "", isVisible: false };
  }

  changeAddress = (address) => this.setState({ address });

  showQrCodeReader = () => {
    let { isVisible } = this.state;
    this.setState({ isVisible: !isVisible });
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
    let { address } = this.state;
    let { coin, modal } = this.props;

    return (
      <div>
        <div className={style.modalBox}>
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
        </div>

        <div className={style.modalBox}>
          <div className={style.modalBoxSubContainer}>
            <div>
              <h4>수수료</h4>
            </div>
            <h4> 0 SRT</h4>
            <hr />
          </div>
        </div>
        <div className={style.modalBox}>
          <div className={style.modalBoxSubContainer}>
            <ButtonSend
              action={() => alert(i18n.t("LOCKED_WALLET"))}
              // action={() => this.validateAddress()}
              loading={modal.loading}
            />
          </div>
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
  modal: PropTypes.object.isRequired,
  setWalletSendModalLoading: PropTypes.func.isRequired,
};

const mapSateToProps = (store) => ({
  modal: store.wallet.modal,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setWalletSendModalLoading,
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(SendBox);
