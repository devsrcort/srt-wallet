import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCoinSelected } from "../../redux/buyAction";

// MATERIAL
import {
  Grid,
  Checkbox,
  FormControlLabel,
  withStyles
} from "@material-ui/core/";

// ICONS
import { Lens } from "@material-ui/icons";

// COMPONENTS
import Select from "../../../../components/select";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

const stylesCustom = () => ({
  root: {
    color: "#654fa4",
    "&$checked": {
      color: "#68f285"
    }
  },
  rootLabel: {
    fontSize: "15px",
    color: "#fff"
  },
  checked: {
    color: "#68f285"
  }
});

class PaymentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: i18n.t("COINSALE_SEL_COIN"),
      img: null
    };
  }

  coinSelected = (value, title, img = undefined) => {
    const { setCoinSelected, coins } = this.props;
    this.setState({
      title: title,
      value,
      img
    });

    setCoinSelected(title.toLowerCase(), coins[value].address, coins[value].id);
  };

  render() {
    const { title, img } = this.state;
    const { classes, coins, coinsActive } = this.props;
    let coinspayment = [];

    Object.keys(coins).map(key => {
      const val = coins[key];
      let item = {
        img: `images/icons/coins/${val.abbreviation}.png`,
        title: val.abbreviation.toUpperCase(),
        value: key
      };
      if (
        val.abbreviation.toLowerCase() != "lunes" &&
        coinsActive[val.abbreviation].status == "active"
      ) {
        coinspayment.push(item);
      }
    });

    return (
      <div className={style.baseBar}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <span className={style.label}>
              {i18n.t("COINSALE_PAYMENT_SELECT")}
            </span>
            <div className={style.baseBackgroundFlex}>
              <FormControlLabel
                value="cripto"
                classes={{ label: classes.rootLabel }}
                control={
                  <Checkbox
                    checked={true}
                    color="primary"
                    icon={<Lens />}
                    checkedIcon={<Lens />}
                    classes={{ root: classes.root, checked: classes.checked }}
                  />
                }
                label={i18n.t("COINSALE_METHOD_COIN")}
                labelPlacement="start"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <span className={style.label}>
              {i18n.t("COINSALE_PAYMENT_COIN")}
            </span>
            <div className={style.baseBackground}>
              <Select
                list={coinspayment}
                title={title}
                titleImg={img}
                selectItem={this.coinSelected}
                error={null}
                width={"100%"}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PaymentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  setCoinSelected: PropTypes.func.isRequired,
  coins: PropTypes.array.isRequired,
  coinsActive: PropTypes.array.isRequired
};

const mapStateToProps = store => ({
  coins: store.buy.coinsPayment || [],
  coinsActive: store.skeleton.coins || []
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCoinSelected
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesCustom)(PaymentBar));
