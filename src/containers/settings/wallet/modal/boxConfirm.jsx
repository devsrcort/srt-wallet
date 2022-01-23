import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {} from "../../redux/settingsAction";
import { errorInput } from "../../../errors/redux/errorAction";

// UTILS
import { encryptHmacSha512Key } from "../../../../utils/cryptography";
import i18n from "../../../../utils/i18n";

// COMPONENTS
import ButtonContinue from "./buttonContinue.jsx";

// STYLE
import style from "../style.css";

class BoxConfirm extends React.Component {
  constructor() {
    super();
    this.state = {
      password: ""
    };
  }

  setPassword = password => {
    this.setState({ ...this.state, password });
  };

  confirmPassword = () => {
    let { password } = this.state;
    let { user, errorInput, action } = this.props;

    if (user.password === encryptHmacSha512Key(password)) {
      action();
      return;
    }

    errorInput(i18n.t("MESSAGE_INVALID_PASSWORD"));
    return;
  };

  render() {
    let { password } = this.state;
    let { modal } = this.props;

    return (
      <div className={style.modalBox}>
        <div className={style.baseStep}>
          <img
            src="/images/icons/privacy/privacy.png"
            className={style.modalIconCoin}
          />
          <div>
            <span>{i18n.t("ALIAS_MODAL_TRANSACTION")} </span>
          </div>

          <div className={style.confirmFee}>
            <input
              type="password"
              name="txtpass"
              placeholder="*********"
              onChange={event => this.setPassword(event.target.value)}
              value={password}
              className={style.inputTextDefault}
            />
          </div>

          <ButtonContinue
            action={() => this.confirmPassword()}
            loading={modal.loadingAlias}
          />
        </div>
      </div>
    );
  }
}

BoxConfirm.propTypes = {
  user: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  errorInput: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired
};

const mapSateToProps = store => ({
  modal: store.settings.wallet,
  user: store.user.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      errorInput
    },
    dispatch
  );

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(BoxConfirm);
