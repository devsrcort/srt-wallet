import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// COMPONENTS
import FeeBuy from "./feeBuy";
import SecureBuy from "./secureBuy";
import DoneBuy from "./doneBuy";
import ErrorBuy from "./errorBuy";

class BuyModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { modalStep } = this.props;

    switch (modalStep) {
      case 1:
        return <FeeBuy />;
      case 2:
        return <SecureBuy />;
      case 3:
        return <DoneBuy />;
      case 4:
        return <ErrorBuy />;
    }
  }
}

BuyModal.propTypes = {
  modalStep: PropTypes.number.isRequired
};

const mapStateToProps = store => ({
  modalStep: store.buy.modalStep
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyModal);
