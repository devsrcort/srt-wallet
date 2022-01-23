import React from "react";

// COMPONENTS
import LogoLunes from "../../../components/logoLunes";

// UTILS
import i18n from "../../../utils/i18n";

// STYLE
import style from "../style.css";

class EmailMessage extends React.Component {
  render() {
    setTimeout(function() {
      window.location = "https://luneswallet.app/";
    }, 6000);
    return (
      <div className={style.contNewAccount}>
        <center>
          <LogoLunes medium />
        </center>

        <div>
          <img
            src="../../../../images/icons/email/email@2x.png"
            className={style.iconEmailCreateAccount}
          />

          <div className={style.messageConfirmationRegister}>
            {i18n.t("NEW_ACCOUNT_MESSAGE_SENDED")}
          </div>

          <div className={style.arrowToLoginAlign}>
            <div className={style.arrowCircle}>
              <a href="/">
                <img src="../../../../images/icons/arrow/arrow-green-right@1x.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailMessage;
