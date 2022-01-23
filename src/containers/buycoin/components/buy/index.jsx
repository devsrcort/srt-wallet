import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setBuy } from "../../redux/buyAction";

// COMPONENTS
import PaymentBar from "../paymentBar";
import PackCoins from "../packCoins";
import Instructions from "../instructions";
import Loading from "../../../../components/loading";
import ModalBar from "../../../../components/modalBar";

//UTILS
//import { getDefaultFiat } from "../../../../utils/localStorage";
import { convertSmallerCoinUnit } from "../../../../utils/numbers";
import i18n from "../../../../utils/i18n";

// STYLES
import style from "./style.css";

class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      messageError: ""
    };
  }

  validateModal = () => {
    const { buypack, coins, setBuy } = this.props;

    let errors = [];

    if (buypack.idpack == "")
      errors.push(`${i18n.t("COINSALE_ERROR_PACK")} / `);

    if (buypack.coin.address == "" || buypack.coin.abbreviation == "")
      errors.push(`${i18n.t("COINSALE_ERROR_COIN")} / `);

    if (buypack.paycoin == "")
      errors.push(`${i18n.t("COINSALE_ERROR_COIN_PAY")}`);

    if (errors.length > 0) {
      this.setState({
        ...this.state,
        error: true,
        messageError: errors.map(val => {
          return val;
        })
      });
    } else {
      // calcular amount de acordo com o valor
      // let defaultCoin = getDefaultFiat();
      let defaultCoin = "BRL";
      let coinPrice = coins[buypack.paycoin].price[defaultCoin].price;
      const amountPay = buypack.amountFiat / coinPrice;
      let decimalPoint = coins[buypack.paycoin].decimalPoint;

      const data = {
        amount: convertSmallerCoinUnit(amountPay, decimalPoint),
        coin: buypack.paycoin,
        address: coins[buypack.paycoin] ? coins[buypack.paycoin].address : "",
        receiveAddress: coins[buypack.coin.abbreviation]
          ? coins[buypack.coin.abbreviation].address
          : "",
        decimalPoint: decimalPoint
      };

      setBuy(data);
    }
  };

  render() {
    const { error, messageError } = this.state;
    const { loading } = this.props;

    return (
      <div>
        {error ? <ModalBar type="error" message={messageError} timer /> : null}
        <div>
          <PackCoins />
        </div>
        <PaymentBar />

        <div className={style.baseButton}>
          <button
            className={style.buttonBorderGreen}
            onClick={() => this.validateModal()}
          >
            {loading ? <Loading /> : i18n.t("COINSALE_BT_INIT")}
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <Instructions />
        </div>
      </div>
    );
  }
}

Buy.propTypes = {
  buypack: PropTypes.object.isRequired,
  coins: PropTypes.array.isRequired,
  setBuy: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

const mapStateToProps = store => ({
  buypack: store.buy.buypackage,
  coins: store.buy.coinsBuy,
  loading: store.buy.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setBuy
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Buy);
