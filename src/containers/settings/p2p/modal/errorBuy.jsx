import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// UTILS
import i18n from "../../../../utils/i18n";

// COMPONENTS
import Loading from "../../../../components/loading";

// STYLES
import style from "./style.css";

class ErrorBuy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return (
        <div className={style.modalBox}>
          <Loading color="lunes" />
        </div>
      );
    } else {
      return (
        <div className={style.modalBox}>
          <img
            src="/images/icons/error/error.png"
            className={style.imageResult}
            alt="Error image"
          />
          <div>{i18n.t("COINSALE_INFO_ERROR")}</div>
        </div>
      );
    }
  }
}

ErrorBuy.propTypes = {
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = store => ({
  loading: store.buy.loading
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBuy);
