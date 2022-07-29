import React from "react";

// STYLE
import style from "../../style.css";

// UTILS
import i18n from "../../../../utils/i18n";

class BoxAlreadyTransfer extends React.Component {
  render() {
    return (
      <div>
      <div className={style.modalBoxSubContainer}>
        <img src="/images/icons/error/error.png" />
        <div className={style.errorString}>
          {i18n.t("MODAL_ALREADY_SEND_TOKEN")}
        </div>
      </div>
      </div>
    );
  }
}

export default BoxAlreadyTransfer;
