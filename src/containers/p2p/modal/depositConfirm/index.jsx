import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  handleConfirmSell,
  openDeposit,
  confirmOrder
} from "../../redux/p2pAction";
import DepositModal from "../../modal/deposit";

import { Close } from "@material-ui/icons/";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

class DepositConfirmModal extends React.Component {
  openModalDeposit = () => {
    const { openDeposit, order, confirmOrder } = this.props;
    openDeposit(order);

    if (order.id) {
      confirmOrder(order.id);
      openDeposit(order);
    }
  };

  render() {
    const { handleConfirmSell, depositIsOpen, textValue } = this.props;
    return depositIsOpen ? (
      <DepositModal />
    ) : (
      <div className={style.containerSellConfirm}>
        <div>
          <Close
            className={style.arrowBack}
            onClick={() => handleConfirmSell(false)}
          />
        </div>
        <img
          alt={"sell-confirm"}
          src="/images/modal/sell-confirm.png"
          className={style.imgSellConfirm}
        />
        <div>
          <p className={style.textSellConfirm}>{textValue}</p>
        </div>
        <div className={style.boxBtnSellConfirm}>
          <button
            className={style.btnSellConfirm}
            onClick={() => this.openModalDeposit()}
          >
            {i18n.t("P2P_BUTTON_CONFIRM_RECEIPT")}
          </button>
        </div>
      </div>
    );
  }
}

DepositConfirmModal.propTypes = {
  order: PropTypes.object,
  handleConfirmSell: PropTypes.func,
  openDeposit: PropTypes.func,
  depositIsOpen: PropTypes.bool,
  confirmOrder: PropTypes.func,
  textValue: PropTypes.string
};

const mapStateToProps = store => ({
  depositIsOpen: store.p2p.openDeposit,
  order: store.p2p.chat.iduser
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openDeposit,
      handleConfirmSell,
      confirmOrder
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositConfirmModal);
