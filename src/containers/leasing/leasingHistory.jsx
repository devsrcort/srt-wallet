import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setLeasingLoading,
  cancelLeasing,
  getLeasingInfo
} from "../leasing/redux/leasingAction";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";

// UTILS
import { formatDate } from "../../utils/numbers";
import i18n from "../../utils/i18n";

// CONSTANTS
import { blockexplorer } from "../../constants/apiBaseUrl";

// STYLES
import style from "./style.css";

class LeasingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleHistory: undefined
    };
  }

  stateDataHistory = key => {
    let { toggleHistory } = this.state;

    this.setState({
      toggleHistory: toggleHistory === key ? undefined : key
    });
  };

  handleClass = (index, type) => {
    let { toggleHistory } = this.state;
    if (type) {
      return toggleHistory !== undefined && toggleHistory !== index
        ? style.opacityItem
        : style.itemHistorico;
    }

    return style.opacityItem;
  };

  cancelLeasing(txId) {
    let {
      coinFee,
      cancelLeasing,
      user,
      coins,
      getLeasingInfo,
      setLeasingLoading
    } = this.props;

    cancelLeasing({
      txId,
      coinFee,
      password: user.password,
      coinName: coins.lunes.abbreviation
    });

    setLeasingLoading(true);

    setTimeout(() => {
      getLeasingInfo(
        coins.lunes.abbreviation,
        coins.lunes.address,
        coins.lunes.decimalPoint,
        user.password
      );
    }, 5000);

    return;
  }

  renderBtCancel = (status, txId, type) => {
    if (status === 1) {
      return (
        <div className={style.iconLeasing}>
          <img
            src="images/icons/general/leasing@1x.png"
            onClick={() => {
              if (type) {
                confirm(i18n.t("MODAL_LEASING_CONFIRM"))
                  ? this.cancelLeasing(txId)
                  : null;
              }
            }}
          />
          {i18n.t("LEASING_BT_CANCEL")}
        </div>
      );
    } else {
      return null;
    }
  };

  renderHistory = () => {
    let { toggleHistory } = this.state;
    let { history } = this.props;

    if (history === undefined) {
      return (
        <div className={style.notFound}>
          <center>{i18n.t("MESSAGE_NOTHING_FOUND")}</center>
        </div>
      );
    }

    return history.txs.map((value, index) => (
      <div key={index}>
        <div>
          <Grid
            item
            xs={12}
            className={this.handleClass(index, value.to)}
            onClick={() => this.stateDataHistory(index)}
          >
            <Grid item xs={4}>
              {formatDate(value.date, "DM")}
              &nbsp; {formatDate(value.date, "HMS")}
            </Grid>
            <Grid item xs={4}>
              <span className={style.textGreen}>{value.amount}</span>
            </Grid>
            <Grid item xs={4}>
              {this.renderBtCancel(1, value.txID, value.to)}
            </Grid>
          </Grid>

          <div>
            <Grid
              item
              xs={12}
              className={toggleHistory !== index ? style.toggleHistory : null}
            >
              <Grid item xs={12} className={style.itemDataHistorico}>
                <Grid item xs={12} className={style.descriptionHistory}>
                  <div>{i18n.t("LEASING_TITLE_EXPLORER")}</div>
                  <a
                    href={blockexplorer["lunes"] + value.txID}
                    target="blank"
                  >
                    {value.txID}
                  </a>
                </Grid>
                {value.to ? (
                  <Grid item xs={12} className={style.descriptionHistory}>
                    <div>{i18n.t("LEASING_TITLE_NODE")}</div>
                    <div>{value.to}</div>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    ));
  };

  loadModalLeasing = () => {
    let { openModal } = this.props;
    openModal();
  };

  render() {
    const { coins, leasingBalance } = this.props;
    const balance = coins.lunes ? coins.lunes.balance.available : "0";

    return (
      <div>
        <Grid container className={style.containerTransactions}>
          <Grid container item xs={11} sm={10} md={10}>
            <Grid item xs={6} md={4}>
              <div className={style.boxCard}>
                {i18n.t("LEASING_BALANCE_LABEL")}
                <div className={style.strongText}>{balance}</div>
              </div>
            </Grid>

            <Grid item xs={6} md={4}>
              <div className={style.boxCard}>
                {i18n.t("LEASING_BALANCE_ACTIVE")}
                <div className={style.strongTextGreen}>{leasingBalance}</div>
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <button
                className={style.buttonEnable}
                onClick={() => this.loadModalLeasing()}
              >
                {i18n.t("LEASING_TITLE_NEW")}
              </button>
            </Grid>
          </Grid>

          <Grid item xs={11} sm={10} md={10}>
            <div className={style.contentTransactions}>
              <Grid container className={style.headerContent}>
                <Grid item xs={4}>
                  {i18n.t("LEASING")}
                </Grid>
                <Grid item xs={4}>
                  {i18n.t("LEASING_TITLE_AMOUNT")}
                </Grid>
                <Grid item xs={4}>
                  {i18n.t("LEASING_TITLE_STATUS")}
                </Grid>
              </Grid>
              {this.renderHistory()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

LeasingHistory.propTypes = {
  openModal: PropTypes.func,
  coins: PropTypes.array.isRequired,
  history: PropTypes.object,
  setLeasingLoading: PropTypes.func,
  leasingBalance: PropTypes.number,
  cancelLeasing: PropTypes.func,
  getLeasingInfo: PropTypes.func,
  coinFee: PropTypes.number,
  user: PropTypes.object
};

const mapStateToProps = store => ({
  coins: store.skeleton.coins,
  history: store.leasing.history.data,
  leasingBalance: store.leasing.leasingBalance,
  coinFee: store.leasing.coinFee.low,
  user: store.user.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setLeasingLoading,
      cancelLeasing,
      getLeasingInfo
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeasingHistory);
