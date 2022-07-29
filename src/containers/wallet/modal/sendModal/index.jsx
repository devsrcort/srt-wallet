import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";

// COMPONENTS
import SendBox from "./sendBox"
import BoxResult from "./boxResult";
import BoxResultError from "./boxResultError";
import BoxAlreadyTransfer from "./boxAlreadyTransfer";

// STYLE
import style from "../../style.css";

class SendModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  renderContent = () => {
    let { modal, wallet } = this.props;
    if (modal.step === 0) return <SendBox coin={wallet.selectedCoin} />;
    if (modal.step === 1) return <BoxResult coin={wallet.selectedCoin} />;
    if (modal.step === 2) return <BoxResultError coin={wallet.selectedCoin} />;
    if (modal.step === 3) return <BoxAlreadyTransfer coin={wallet.selectedCoin} />;
  };

  render() {
    return <div className={style.baseStep}>{this.renderContent()}</div>;
  }
}

SendModal.propTypes = {
  modal: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

const mapSateToProps = (store) => ({
  wallet: store.wallet,
  modal: store.wallet.modal,
});

export default connect(mapSateToProps, null)(SendModal);
