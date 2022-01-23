import React from "react";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

class DoneModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={style.modalBox}>
        <img
          src={"/images/icons/confirm/confirm.png"}
          className={style.iconInfor}
        />
        <div className={style.totalConfirm}>
          <span>{i18n.t("P2P_SIGNATURE_CONFIRM")}</span>
        </div>
      </div>
    );
  }
}

export default DoneModal;
