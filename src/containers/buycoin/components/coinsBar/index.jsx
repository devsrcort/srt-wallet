import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCoinPackage,
  getCoinForPayment,
  getHistoryBuy,
  setClearBuyPack,
  getLunesBuyPrices
} from "../../redux/buyAction";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";

// MATERIAL ICONS
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ArrowDropDown,
  ArrowDropUp
} from "@material-ui/icons";

// UTILS
import i18n from "../../../../utils/i18n";
import { getDefaultFiat } from "../../../../utils/localStorage";

// STYLE
import style from "./style.css";

class CoinsBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coinActive: null
    };
  }

  moveSlide = (direction = "next") => {
    if (direction === "prev") this.slider.slickPrev();
    else this.slider.slickNext();
  };

  setCoin = (id, coin, address) => {
    const {
      getCoinPackage,
      getCoinForPayment,
      getHistoryBuy,
      setClearBuyPack
    } = this.props;

    setClearBuyPack();
    getCoinPackage(id, coin, address);
    getCoinForPayment(coin);
    getHistoryBuy(coin);
  };

  getFixedCoins = () => {
    const { getLunesBuyPrices, price } = this.props;
    getLunesBuyPrices(price);
    return;
  };

  componentDidMount() {
    this.getFixedCoins();
  }

  renderArrowPercent = val => {
    if (parseFloat(val) < 0) {
      return <ArrowDropDown className={style.arrowPercentDown} />;
    } else {
      return <ArrowDropUp className={style.arrowPercentUp} />;
    }
  };

  renderCoins = () => {
    const { coinsEnabled, coins, selected } = this.props;

    let defaultCoin = getDefaultFiat();

    return coinsEnabled.map((val, index) => {
      let coin = coins[val.value.abbreviation];

      if (!coin || coins[val.value.abbreviation].status != "active") return;

      const coinPrice = coins[val.value.abbreviation].price[defaultCoin].price;
      const active = val.title === selected.toUpperCase() ? true : false;

      return (
        <div
          className={null}
          key={index}
          onClick={() =>
            this.setCoin(
              val.value.id,
              val.value.abbreviation,
              val.value.address
            )
          }
        >
          <div className={active ? style.boxCoinActive : style.boxCoin}>
            <div className={style.boxIconCoin}>
              <img
                className={style.iconCoin}
                src={"images/icons/coins/" + val.value.abbreviation + ".png"}
              />
            </div>

            <Hidden smDown>
              <div className={style.boxLabelCoin}>
                {val.title} <br />
                {coin.price[defaultCoin].symbol + coinPrice.toFixed(3)}
              </div>
            </Hidden>
          </div>
        </div>
      );
    });
  };

  render() {
    const { coinsEnabled } = this.props;

    if (coinsEnabled.length < 1)
      return (
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          {i18n.t("COINSALE_ERROR_RELOAD")}
        </div>
      );

    let settings = {
      arrows: false,
      draggable: true,
      dots: false,
      infinite: false,
      speed: 200,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1279,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 959,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 599,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    };

    return (
      <div className={style.contentCoins}>
        <Grid container style={{ justifyContent: "center" }}>
          <Hidden xsDown>
            <Grid item xs={1} className={style.arrowControl}>
              <IconButton
                color="inherit"
                aria-label={i18n.t("TEXT_PREV")}
                onClick={() => this.moveSlide("prev")}
              >
                <KeyboardArrowLeft />
              </IconButton>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={10}>
            <Slider ref={c => (this.slider = c)} {...settings}>
              {this.renderCoins()}
            </Slider>
          </Grid>

          <Hidden xsDown>
            <Grid item xs={1} className={style.arrowControl}>
              <IconButton
                color="inherit"
                aria-label={i18n.t("TEXT_PREV")}
                onClick={() => this.moveSlide()}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
  }
}

CoinsBar.propTypes = {
  getCoinForPayment: PropTypes.func.isRequired,
  getCoinPackage: PropTypes.func.isRequired,
  getHistoryBuy: PropTypes.func.isRequired,
  setClearBuyPack: PropTypes.func.isRequired,
  coinsEnabled: PropTypes.array.isRequired,
  coins: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired
};

const mapStateToProps = store => ({
  coinsEnabled: store.buy.coins,
  price: store.skeleton.coins,
  coins: store.buy.coinsBuy,
  selected: store.buy.buypackage.coin.abbreviation
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCoinPackage,
      getCoinForPayment,
      getHistoryBuy,
      setClearBuyPack,
      getLunesBuyPrices
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinsBar);
