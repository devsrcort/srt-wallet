import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// COMPONENTS
import DoneModal from "./doneModal";
import FeeModal from "./feeModal";
import SecureBuy from "./secureBuy";
import ErrorBuy from "./errorBuy";

class FlowModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { modalStep } = this.props;

    switch (modalStep) {
      case 1:
        return <FeeModal />;
      case 2:
        return <SecureBuy />;
      case 3:
        return <DoneModal />;
      case 4:
        return <ErrorBuy />;
    }
  }
}

FlowModal.propTypes = {
  modalStep: PropTypes.number.isRequired
};

const mapStateToProps = store => ({
  modalStep: store.p2p.modalStep
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowModal);
