import React from "react";
import PropTypes from "prop-types";

// LOCAL COMPONENTS
import Header from "../components/header";
import DepositModal from "../modal/deposit";
import Rooms from "./rooms.jsx";

//REDUX
import { connect } from "react-redux";

// GLOBAL COMPONENTS
import Loading from "../../../components/loading";

// STYLE
import style from "./style.css";

//FUNCTIONS
import { getChatBundle, appendFinalMessage } from "./functions";

//UTILS
import i18n from "./../../../utils/i18n";
import { removeChatTargetScroll } from "./functions";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatTargetContent: undefined,
      bundleCalled: false,
      lastAdOwnerId: -1,
      lastBuyerId: -1
    };
  }
  componentDidMount() {
    this.callChatBundle();
    let { chatDetails } = this.props;
    let { currentOrder } = chatDetails;
    let { status, updatedAt } = currentOrder;
    if (status === "confirmed") {
      appendFinalMessage(updatedAt);
    } else if (status === "canceled") {
      appendFinalMessage(updatedAt, true);
    }
    removeChatTargetScroll();
  }
  componentDidUpdate() {}
  callChatBundle = () => {
    let { chatDetails } = this.props.p2pStore;
    let { typeOfUser } = chatDetails;
    let { seller, buyer, currentOrder } = chatDetails;
    let { id: buyerId } = buyer || {};
    let { id: adOwnerId } = seller;
    let { id: adId } = currentOrder;
    if (typeOfUser === "buyer") {
      getChatBundle({ adId, adOwnerId, buyerId });
      this.setState({ chatTargetContent: <Loading /> });
    } else {
      //TODO i18n
      this.setState({
        chatTargetContent: <h1>{i18n.t("P2P_CHAT_SELECT_AN_USER_TO_CHAT")}</h1>
      });
    }
  };

  render() {
    const { openDeposit, chatDetails } = this.props.p2pStore;
    const { typeOfUser } = chatDetails;
    const { rooms } = chatDetails.currentOrder.chat;
    return (
      <div>
        {openDeposit == true ? (
          <DepositModal />
        ) : (
          <div className={style.baseChat}>
            <Header />
            <div className={style.chatTarget + " chatTarget"} id={"chatTarget"}>
              {typeOfUser === "seller" ? (
                <Rooms rooms={rooms} />
              ) : (
                this.state.chatTargetContent
              )}
              {/*Chat will be rendered here, and this content will be removed*/}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Chat.propTypes = {
  p2pStore: PropTypes.object.isRequired,
  chatDetails: PropTypes.object.isRequired
};

const mapStateToProps = store => ({
  p2pStore: store.p2p,
  chatDetails: store.p2p.chatDetails
});


export default connect(
  mapStateToProps
)(Chat);
