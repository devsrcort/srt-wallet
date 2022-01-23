import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// UTILS
import i18n from "../../../utils/i18n";

// STYLE
import style from "./style.css";

// COMPONENTS
import Loading from "../../../components/loading";

class DoneBuy extends React.Component {
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
            src="/images/icons/confirm/confirm.png"
            className={style.imageResult}
          />
          <div>
            {i18n.t("COINSALE_SUCCESS_1")}
          </div>

          <div className={style.smallDescription}>
            {i18n.t("PAYMENT_TEXT_HISTORY")}
          </div>
        </div>
      );
    }
  }
}

DoneBuy.propTypes = {
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = store => ({
  loading: store.buy.loading
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoneBuy);
