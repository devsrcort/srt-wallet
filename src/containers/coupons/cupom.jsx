import React from "react";
import PropTypes from "prop-types";

// REDUX
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { errorRequest } from "../errors/redux/errorAction.js";
import { verifyCoupon } from "./redux/couponsAction.js";

//COMPONENTS
import Loading from "../../components/loading.jsx";
import Instructions from "./instructions";

// MATERIAL UI
import { Grid } from "@material-ui/core";

// UTILS
import i18n from "../../utils/i18n";

// STYLE
import style from "./style.css";

class Cupom extends React.Component {
  constructor() {
    super();

    this.inputEL;
    this.state = {
      code: "",
      errors: undefined
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.inputEL = document.querySelector(`.inputCoupon`);
    }, 200);
  }
  setInputTo = type => {
    if (type === "success") {
      this.inputEL.classList.remove(style.error, style.warning);
      this.inputEL.classList.add(style.success);
    } else if (type === "error") {
      this.inputEL.classList.remove(style.success, style.warning);
      this.inputEL.classList.add(style.error);
    } else if (type === "warning") {
      this.inputEL.classList.remove(style.success, style.error);
      this.inputEL.classList.add(style.warning);
    }
  };
  componentDidUpdate() {
    let { coupons } = this.props;
    let { coupon } = coupons;
    if (coupon.verified === false) {
      this.setInputTo("error");
      this.props.coupons.coupon.verified = undefined;
    }
  }

  handleChange = event => {
    let val = event.target.value;

    if (val.search(/[^0-9a-zA-Z-]/gi) !== -1) return;

    this.setState({
      ...this.state,
      code: val
    });
  };

  handleSend = () => {
    let { code } = this.state;
    let { verifyCoupon, coins } = this.props;
    if (!code && code.length <= 1) {
      this.setInputTo("error");
      errorRequest(i18n.t("SHORT_COUPON_LENGTH"));
      return;
    }

    verifyCoupon(code, coins);
    return;
  };

  render() {
    const { code } = this.state;
    const { coupons } = this.props;
    const { coupon } = coupons;

    return (
      <Grid container direction="row" justify="center">
        <Grid item xs={12} className={style.box}>
          <div className={style.cupomRow}>
            <label>{i18n.t("VOUCHER_CODE")}</label>
            <input
              className={style.inputTextDefault + " inputCoupon"}
              value={code}
              placeholder="1234-1234-1234-1234"
              maxLength={19}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className={style.row}>
            <Instructions />
          </div>

          <div className={style.row}>
            <button
              className={style.buttonBorderGreen}
              onClick={this.handleSend}
            >
              {coupon.loading ? <Loading /> : i18n.t("VOUCHER_BUTTON")}
            </button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

Cupom.propTypes = {
  verifyCoupon: PropTypes.func.isRequired,
  coins: PropTypes.array.isRequired,
  errorRequest: PropTypes.func,
  coupons: PropTypes.object
};
const mapStateToProps = state => ({
  coins: state.skeleton.coins,
  coupons: state.coupons
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      errorRequest,
      verifyCoupon
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cupom);
