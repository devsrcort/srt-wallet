import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setModalStep,
  openModal,
  setClearBuy,
  getCoinsEnabled
} from "./redux/buyAction";

// COMPONENTS
import Modal from "../../components/modal";
import Tabs from "../../components/tabs";
import History from "./components/history";
import Buy from "./components/buy";
import BuyModal from "./modal/buyModal";
import CoinsBar from "./components/coinsBar";
import Loading from "../../components/loading";

// UTILS
import i18n from "../../utils/i18n";

// STYLE
import style from "./style.css";

class BuyCoins extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount = () => {
    const { setClearBuy } = this.props;
    setClearBuy();
  };

  componentDidMount = () => {
    const { getCoinsEnabled } = this.props;
    getCoinsEnabled();
  };

  closeModal() {
    const { setModalStep, openModal } = this.props;
    openModal(false);
    setModalStep(1);
  }

  render() {
    const { modalStep, setModalStep, modalOpen, loading } = this.props;

    const titles = [
      i18n.t("COINSALE_PURCHASE_TAB_TITLE"),
      i18n.t("COINSALE_HISTORY_TAB_TITLE")
    ];
    const contents = [<Buy key={0} />, <History key={1} />];

    if (loading) return <Loading color="wallet" height="80vh" width="100px" />;

    return (
      <div>
        <CoinsBar />
        <div className={style.box}>
          <div className={style.header}>
            <h1>{i18n.t("COINSALE_TITLE")}</h1>
            <p>{i18n.t("COINSALE_DESCRIPTION")}</p>
          </div>

          <Tabs tabTitles={titles} tabContents={contents} justify="center" />

          <Modal
            title={i18n.t("COINSALE_TITLE")}
            content={<BuyModal />}
            show={modalOpen}
            close={
              modalStep === 1 || modalStep === 3 || modalStep === 4
                ? () => this.closeModal()
                : null
            }
            back={modalStep === 2 ? () => setModalStep(modalStep - 1) : null}
          />
        </div>
      </div>
    );
  }
}

BuyCoins.propTypes = {
  modalStep: PropTypes.number.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  setModalStep: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  setClearBuy: PropTypes.func.isRequired,
  getCoinsEnabled: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = store => ({
  modalStep: store.buy.modalStep,
  modalOpen: store.buy.modalOpen,
  loading: store.buy.loadingCoins
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setModalStep,
      setClearBuy,
      openModal,
      getCoinsEnabled
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyCoins);
