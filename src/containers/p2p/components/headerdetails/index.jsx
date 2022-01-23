import React from "react";
import PropTypes from "prop-types";
// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  openDeposit,
  acceptOfferWhenBuying,
  chatDetailsSetter
} from "../../redux/p2pAction";

//UTILS
import i18n from "./../../../../utils/i18n";

// MATERIAL UI
import { Grid } from "@material-ui/core";
import { KeyboardArrowUp, Clear } from "@material-ui/icons";

// STYLE
import style from "./style.css";

//FUNCTIONS

class HeaderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressBuyer: "",
      errors: []
    };
    this.renderErrors = this.renderErrors.bind(this);
  }

  coinSelected = (value, title, img = undefined) => {
    this.setState({
      ...this.state,
      coin: {
        name: title,
        value,
        img
      }
    });
  };

  handleClick = () => {
    const { acceptOfferWhenBuying, openDeposit } = this.props;
    const { currentOrder: order } = this.props.chatDetails;
    const { addressBuyer } = this.state;

    let error = [];

    if (addressBuyer == "") {
      error.push(i18n.t("P2P_CHANGE_ADDRESS"));
    }

    if (error.length > 0) {
      this.setState({
        ...this.state,
        errors: error
      });
    } else {
      acceptOfferWhenBuying({
        coin: "lunes",
        orderId: order.id,
        addressBuyer: addressBuyer
      });

      openDeposit(order);
    }
  };

  handleFields = e => {
    const { name, value } = e.target;

    switch (name) {
      case "addressBuyer":
        this.setState({
          ...this.state,
          addressBuyer: value
        });
        break;
    }
  };

  renderErrors = () => {
    const { errors } = this.state;

    return errors.map((val, key) => {
      return (
        <div key={key}>
          <div className={style.textErrorSmall}>
            <Clear className={style.iconListValid} />
            {val}
          </div>
        </div>
      );
    });
  };

  renderAddresInput = orderStatusIsOpen => {
    if (orderStatusIsOpen)
      return (
        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={9}>
            <input
              type="text"
              placeholder={i18n.t("P2P_ADDRESS_TO_SEND")}
              className={style.inputCenter}
              value={this.state.addressBuyer}
              name="addressBuyer"
              onChange={e => this.handleFields(e)}
            />
          </Grid>
        </Grid>
      );
  };

  renderButtons = (orderStatusIsOpen, order) => {
    const { openDeposit } = this.props;

    if (orderStatusIsOpen) {
      return (
        <button className={style.btBuy} onClick={this.handleClick}>
          {i18n.t("P2P_HEADER_BUY_2")}
        </button>
      );
    }

    return (
      <button className={style.btBuy} onClick={() => openDeposit(order)}>
        {i18n.t("P2P_INFORMATION")}
      </button>
    );
  };

  renderContentToBuy = order => {
    const { userEmailLoggedIn } = this.props;
    const orderStatusIsOpen = order.status === "open";

    if (userEmailLoggedIn === order.sell.user.email) return null;

    return (
      <span>
        {this.renderAddresInput(orderStatusIsOpen)}

        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={9}>
            {this.renderErrors()}
            {this.renderButtons(orderStatusIsOpen, order)}
          </Grid>
        </Grid>
      </span>
    );
  };

  render() {
    const { typeOfChatUser, currentOrder: order } = this.props.chatDetails;

    if (!order) return null;

    return (
      <div>
        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={4}>
            <div className={style.formGroup}>
              <div className={style.textSmall}>
                {i18n.t("P2P_HEADER_PAYMENT")}
              </div>
              <div className={style.listItemCoin}>
                <img src={`images/icons/coins/${order.buy.coin}.png`} />
                {order.buy.coin.toUpperCase()}
              </div>
            </div>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4}>
            <div className={style.formGroup}>
              <div className={style.textSmall}>{i18n.t("P2P_HEADER_BUY")}</div>
              <div className={style.listItemCoin}>
                <img src={`images/icons/coins/${order.sell.coin}.png`} />
                {order.sell.coin.toUpperCase()}
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          style={{ display: typeOfChatUser === "buyer" ? "flex" : "none" }}
        >
          <Grid item xs={3} />
          <Grid item xs={9}>
            <div className={style.boxDescription}>{order.description}</div>
          </Grid>
        </Grid>
        {this.renderContentToBuy(order)}

        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="flex-end"
        >
          <KeyboardArrowUp
            onClick={() => this.props.showHeaderDetails()}
            className={style.arrowUp + " showHeaderDetails"}
          />
        </Grid>
      </div>
    );
  }
}
HeaderDetails.propTypes = {
  showHeaderDetails: PropTypes.func,
  acceptOfferWhenBuying: PropTypes.func,
  openDeposit: PropTypes.func,
  chatDetails: PropTypes.object.isRequired,
  chatDetailsSetter: PropTypes.func.isRequired,
  order: PropTypes.object,
  userEmailLoggedIn: PropTypes.string
};

const mapStateToProps = store => ({
  chatDetails: store.p2p.chatDetails,
  order: store.p2p.chat.iduser,
  userEmailLoggedIn: store.user.user.email
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openDeposit,
      acceptOfferWhenBuying,
      chatDetailsSetter
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderDetails);
