import React from "react";
import style from "./style.css";
import i18n from "../../../../utils/i18n";

class InterestModal extends React.Component {
  render() {
    return (
      <div className={style.modalContainerChat}>
        <img src="/images/modal/chat@2x.png" className={style.modalImgChat} />
        <div className={style.openChat}>
          <p className={style.textOpenChat}>{i18n.t("P2P_TEXT_7")}</p>
        </div>
        <div className={style.btnChat}>
          <button className={style.btnTalkChat}>{i18n.t("P2P_TEXT_8")}</button>
          <button className={style.btnNotTalkChat}>
            {i18n.t("P2P_TEXT_9")}
          </button>
        </div>
      </div>
    );
  }
}

InterestModal.propTypes = {};

export default InterestModal;
