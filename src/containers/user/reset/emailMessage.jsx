import React from "react";
import { Link } from "react-router-dom";

// UTILS
import i18n from "../../../utils/i18n";

// COMPONENTS
import LogoSRT from "../../../components/logoSRT";

// STYLE
import style from "../style.css";

class EmailMessage extends React.Component {
  render() {
    return (
      <div>
        <center>
          <LogoSRT medium />
        </center>
        <img
          src="../../../../images/icons/email/email@1x.png"
          className={style.iconEmail}
        />
        <div className={style.resetEmailSend}>
          {i18n.t("RESET_EMAIL_SENDED")}
        </div>
        <Link
          className={style.resetLinkLogin}
          to="/"
          onClick={() => this.backLink()}
        >
          <button className={style.buttonEnable}>{i18n.t("BTN_LOGIN")}</button>
        </Link>
      </div>
    );
  }
}

export default EmailMessage;
