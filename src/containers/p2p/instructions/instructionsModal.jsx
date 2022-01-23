import React from "react";

// STYLE
import style from "./style.css";

// UTILS
import i18n from "../../../utils/i18n";

class InstructionsModal extends React.Component {
  render() {
    return (
      <div className={style.alignInstructions}>
        <div className={style.infoModal}>
          <p>
            <strong>{i18n.t("P2P_INFORMATION_SIGNATURE_TITLE_1")}</strong>
          </p>
        </div>
        <ol>
          <li>
            <span> {i18n.t("P2P_INFORMATION_SIGNATURE_PLANS_12_MONTHS")}</span>
          </li>
          <li>
            <span> {i18n.t("P2P_INFORMATION_SIGNATURE_PLANS_06_MONTHS")}</span>
          </li>
          <li>
            <span> {i18n.t("P2P_INFORMATION_SIGNATURE_PLANS_03_MONTHS")}</span>
          </li>
          <li>
            <span> {i18n.t("P2P_INFORMATION_SIGNATURE_PLANS_01_MONTHS")}</span>
          </li>
        </ol>
        <div className={style.infoModal}>
          <strong>{i18n.t("P2P_INFORMATION_SIGNATURE_TITLE_2")}</strong>
        </div>
        <ol>
          <li>
            <span> {i18n.t("P2P_INFORMATION_ESCROW_1")}</span>
          </li>
          <li>
            <span> {i18n.t("P2P_INFORMATION_ESCROW_2")}</span>
          </li>
          <li>
            <span> {i18n.t("P2P_INFORMATION_ESCROW_3")}</span>
          </li>
        </ol>
        <div className={style.infoModal}>
          <p>
            <strong>{i18n.t("P2P_INFORMATION_FOOTER")}</strong>
          </p>
        </div>
      </div>
    );
  }
}

export default InstructionsModal;
