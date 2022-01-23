import React from "react";
import PropTypes from "prop-types";

// MATERIAL UI
import { Grid, Input } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  closeAvaliation,
  closeChat,
  setRatingOrder
} from "../../redux/p2pAction";
// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

//COMPONENTS
import Starvotes from "../../components/starvotes";

//UTILS
import { encryptMd5 } from "./../../../../utils/cryptography.js";

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      description: "",
      orderId: ""
    };
  }
  selectVote = val => {
    this.setState({
      value: val || 0
    });
  };
  close = () => {
    const { closeAvaliation, closeChat } = this.props;
    closeAvaliation();
    closeChat();
  };
  renderPictureGravatar = email => {
    const defaultImg =
      "https://luneswallet.app/images/icons/p2p/lunio-user300x300.jpg";
    return (
      "https://s.gravatar.com/avatar/" +
      encryptMd5(email.toLowerCase()) +
      "?s=300" +
      "&d=" +
      defaultImg
    );
  };
  handleValuefaultChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };
  handleRatingOrder = () => {
    const { order, setRatingOrder } = this.props;
    let { value, description } = this.state;
    let rating = { value, description, orderId: order.id };
    setRatingOrder(rating);
    this.close();
  };
  render() {
    const { order, userEmail } = this.props;
    let { value, description } = this.state;

    if (!order) return null;

    let isComprador = userEmail == order.sell.user.email;

    return (
      <Grid container>
        <Grid item xs={12}>
          <div className={style.profile}>
            <Avatar
              src={this.renderPictureGravatar(
                isComprador ? order.buy.user.email : order.sell.user.email
              )}
              className={style.avatar}
            />
            <div className={style.userName}>
              <span className={style.name}>
                {isComprador ? order.buy.user.name : order.sell.user.name}{" "}
                {isComprador ? order.buy.user.name : order.sell.user.userName}
              </span>
            </div>
            <div className={style.hr} />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className={style.avaliation}>
            <span className={style.spanTitle}>
              {isComprador ? i18n.t("P2P_TEXT_15") : i18n.t("P2P_TEXT_3")}
            </span>
            <div className={style.starVotes}>
              <Starvotes votes={value} enable selectVote={this.selectVote} />
            </div>
            <div>
              <Input
                className={style.comment}
                aria-label="comment"
                value={description}
                onChange={this.handleValuefaultChange("description")}
              />
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className={style.btnConfirm}>
            <button
              className={style.buttonCard}
              onClick={() => this.handleRatingOrder()}
            >
              {i18n.t("P2P_BUTTON_CONFIRM")}
            </button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

ConfirmModal.propTypes = {
  order: PropTypes.object,
  userEmail: PropTypes.string,
  setRatingOrder: PropTypes.func,
  closeAvaliation: PropTypes.func,
  closeChat: PropTypes.func
};

const mapStateToProps = store => ({
  order: store.p2p.order,
  userEmail: store.user.user.email
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ closeAvaliation, closeChat, setRatingOrder }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmModal);

//Criar um container para centralizar os itens
