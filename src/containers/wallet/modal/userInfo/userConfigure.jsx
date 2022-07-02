import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setWalletSendModalLoading } from "../../redux/walletAction";

// COMPONENTS
import ButtonRegAuth from "./buttonRegAuth.jsx";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "../../style.css";

class UserConfigure extends React.Component {
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

  handleQrCodeReader = () => {
    let { address } = this.state;
    let { coin, user } = this.props;

    return (
      <div className={style.modalBox}>
        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("PLACEHOLDER_FIRST_NAME")}</h4>
          </div>
          <div className={style.modalBoxValueContainer}>
            <h4>{user.name}</h4>
            <hr />
          </div>
        </div>
        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("PLACEHOLDER_PHONE_NUM")}</h4>
          </div>
          <div className={style.modalBoxValueContainer}>
            <h4>{user.phonenum}</h4>
            <hr />
          </div>
        </div>
        <div className={style.modalBoxSubContainer}>
          <div>
            <h4>{i18n.t("PLACEHOLDER_EMAIL")}</h4>
          </div>
          <div className={style.modalBoxValueContainer}>
            <h4>{user.email}</h4>
            <hr />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.handleQrCodeReader()}</div>;
  }
}

UserConfigure.propTypes = {
  coin: PropTypes.string.isRequired,
  modal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setWalletSendModalLoading: PropTypes.func.isRequired,
};

const mapSateToProps = (store) => ({
  user: store.user.user,
  modal: store.wallet.modal,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setWalletSendModalLoading,
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(UserConfigure);
