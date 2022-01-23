import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setBuyPackage } from "../../redux/buyAction";

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

// COMPONENTS
import CardPack from "../cardPack";
import Loading from "../../../../components/loading";

// STYLE
import style from "./style.css";

class PackCoins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activecard: null
    };
  }

  moveSlide = (direction = "next") => {
    if (direction === "prev") this.slider.slickPrev();
    else this.slider.slickNext();
  };

  renderArrowPercent = val => {
    if (parseFloat(val) < 0) {
      return <ArrowDropDown className={style.arrowPercentDown} />;
    } else {
      return <ArrowDropUp className={style.arrowPercentUp} />;
    }
  };

  handleCard = (id, amount, amountFiat) => {
    const { setBuyPackage } = this.props;

    this.setState({
      ...this.state,
      activecard: id
    });
    
    setBuyPackage(id, amount, amountFiat);
  };

  renderPacks = () => {
    const { packages, selectedCoin } = this.props;
    const { activecard } = this.state;

    return packages.map((val, index) => {
      const active = activecard == val.id ? true : false;

      return (
        <CardPack
          key={index}
          buypack={val}
          selectedCoin={selectedCoin}
          onSelect={this.handleCard}
          active={active}
        />
      );
    });
  };

  render() {
    const {loading,packages} = this.props;

    if (loading)
      return (
        <div style={{ padding: 40 }}>
          <Loading color="lunes" />
        </div>
      );

    if (packages.length < 1) {
      return (
        <h2 style={{ textAlign: "center", margin: 40 }}>
          {i18n.t("COINSALE_SEL_COIN")}
        </h2>
      );
    }

    let settings = {
      arrows: false,
      draggable: true,
      dots: false,
      infinite: false,
      speed: 200,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1279,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 959,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 599,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    };

    return (
      <div>
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

          <Grid item xs={12} sm={10} style={{ minHeight: 300 }}>
            <Slider ref={c => (this.slider = c)} {...settings}>
              {this.renderPacks()}
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

PackCoins.propTypes = {
  packages: PropTypes.array.isRequired,
  setBuyPackage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedCoin: PropTypes.object.isRequired
};

const mapStateToProps = store => ({
  packages: store.buy.packages || [],
  loading: store.buy.loadingPackages,
  selectedCoin: store.buy.buypackage.coin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setBuyPackage
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackCoins);
