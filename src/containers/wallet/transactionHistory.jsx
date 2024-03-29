import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setWalletLoading } from "./redux/walletAction";
import { loadWalletInfo } from "../skeleton/redux/skeletonAction";

// CONSTANTS
import { blockexplorer } from "../../constants/apiBaseUrl";

// STYLE
import style from "./style.css";

// MATERIAL UI
import Grid from "@material-ui/core/Grid";

// COMPONENTS
import Loading from "../../components/loading";

// UTILS
import i18n from "../../utils/i18n";
import { formatDate } from "../../utils/numbers";

class TransactionHistory extends React.Component {
  constructor() {
    super();
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

  reloadWallet = () => {
    let { setWalletLoading, loadWalletInfo, user } = this.props;
    setWalletLoading(true);
    loadWalletInfo(user.password);
  };

  hasDefaultPrice = (price, amount) => {
    return price ? (price * amount).toFixed(3) : "";
  };

  defineSymbol = (symbol, price) => {
    return price ? symbol : "";
  };

  renderHistory = () => {
    let { toggleHistory } = this.state;
    let { wallet, coins } = this.props;
    let history = wallet.coinHistory.history;
    let selectedCoin = wallet.selectedCoin;
    let coin = coins[selectedCoin];

    if (!coin || !history || wallet.coinHistory.history.length <= 0) {
      return (
        <div className={style.notFound}>{i18n.t("MESSAGE_NOTHING_FOUND")}</div>
      );
    }

    // let defaultFiat = getDefaultFiat();
    // let defaultCoin = getDefaultCrypto();
    let decimalPoint = coin.decimalPoint;
    let address = coin.address;

    return Object.keys(history).map((val, index) => {
      let transaction = history[index];
      return (
        <div key={index}>
          <div>
            <Grid
              item
              xs={12}
              className={
                toggleHistory !== undefined && toggleHistory !== index
                  ? style.opacityItem
                  : style.itemHistorico
              }
              onClick={() => this.stateDataHistory(index)}
            >
              <Grid item xs={3} sm={2} className={style.typeItems}>
                <div>
                  <img
                    src={
                      "/images/wallet/" +
                      (transaction.fromAddr.toLowerCase() === address.toLowerCase() ? "sent" : "received") +
                      ".png"
                    }
                  />
                </div>
                <div className={style.dateHistory}>
                  {formatDate(parseInt(transaction.timeStamp) * 1000, "DM")}
                </div>
              </Grid>
              <Grid item xs={6} className={style.descriptionHistory}>
                {transaction.describe}
              </Grid>
              <Grid item xs={4} className={style.valueHistory}>
                <div
                  className={
                    transaction.fromAddr.toLowerCase() === address.toLowerCase()
                      ? style.sentHistory
                      : style.receivedHistory
                  }
                >
                  {transaction.fromAddr.toLowerCase() !== address.toLowerCase() || "-"}
                  { transaction.amount.toLocaleString() }
                </div>
                <div>
                </div>
              </Grid>
            </Grid>

            <div>
              <Grid
                item
                xs={12}
                className={toggleHistory !== index ? style.toggleHistory : null}
              >
                <Grid item xs={12} className={style.itemDataHistorico}>
                  <Grid item xs={2}>
                    {" "}
                  </Grid>
                  <Grid item xs={6} sm={7}>
                    <div className={style.titleBlockExplorer}>
                      {i18n.t("TEXT_BLOCKEXPLORER")}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sm={3}
                    className={style.alignTimeInValueHistory}
                  >
                    <div className={style.timeInValueHistory}>
                      {formatDate(parseInt(transaction.timeStamp) * 1000, "HMS")}
                    </div>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={12} className={style.itemDataHistorico}>
                    <Grid item xs={2} className={style.typeItems}>
                      <div> {i18n.t("TEXT_ID")} </div>
                    </Grid>
                    <Grid item xs={10} className={style.descriptionHistory}>
                      <a
                        className={style.idTransactionHistory}
                        target="blanck"
                        href={
                          blockexplorer[selectedCoin]
                            ? blockexplorer[selectedCoin] + transaction.txHash
                            : ""
                        }
                      >
                        {transaction.txHash.substring(0, 33) + "..." || "-"}
                      </a>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} className={style.itemDataHistorico}>
                    <Grid item xs={2} className={style.typeItems}>
                      <div className={style.fromTransactionHistory}>
                        {i18n.t("TEXT_FROM")}
                      </div>
                    </Grid>
                    <Grid item xs={10} className={style.descriptionHistory}>
                      <div className={style.fromTransactionHistory}>
                        {transaction.fromAddr || "-"}
                      </div>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} className={style.itemDataHistorico}>
                    <Grid item xs={2} className={style.typeItems}>
                      <div className={style.forTransactionHistory}>
                        {i18n.t("TEXT_TO")}
                      </div>
                    </Grid>
                    <Grid item xs={10} className={style.descriptionHistory}>
                      <div className={style.forTransactionHistory}>
                        {transaction.toAddr || "-"}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    let { loading } = this.props.wallet.coinHistory;

    return (
      <div>
        <Grid className={style.containerTransactions}>
          <Grid item xs={11} sm={7} md={6}>
            <div className={style.alignItemsHeaderHistory}>
              <div className={style.historyTitle}>
                {i18n.t("TRANSACTION_HISTORY_TITLE")}
              </div>
            </div>
            <div className={style.contentTransactions}>
              {loading ? (
                <Loading margin={"5% 0 0 0"} color="SRT" />
              ) : (
                this.renderHistory()
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

TransactionHistory.propTypes = {
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  coins: PropTypes.array.isRequired,
  loadWalletInfo: PropTypes.func.isRequired,
  setWalletLoading: PropTypes.func.isRequired,
};

const mapSateToProps = store => ({
  user: store.user.user,
  wallet: store.wallet,
  coins: store.skeleton.coins
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadWalletInfo,
      setWalletLoading,
    },
    dispatch
  );

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(TransactionHistory);
