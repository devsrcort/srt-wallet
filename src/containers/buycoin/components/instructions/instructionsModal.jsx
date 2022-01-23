import React from "react";

// STYLE
import style from "./style.css";

// UTILS
import i18n from "../../../../utils/i18n";

class InstructionsModal extends React.Component {
  render() {
    return (
      <div className={style.alignInstructions}>
        <div className={style.infoModal}>
          <p>
            {i18n.t("INSTRUCTION_MODAL_COINSALE_INFO_1")}
          </p>
          <p>
            {i18n.t("INSTRUCTION_MODAL_COINSALE_INFO_2")}
          </p>
          <p>
            {i18n.t("INSTRUCTION_MODAL_COINSALE_INFO_3")}
          </p>
        </div>
      </div>
    );
  }
}

export default InstructionsModal;
