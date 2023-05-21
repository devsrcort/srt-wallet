import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loading, authenticate } from "../redux/userAction";
import { clearMessage, errorInput } from "../../errors/redux/errorAction";

// COMPONENTS
import Loading from "../../../components/loading";
import Footer from "../footer";
import LogoSRT from "../../../components/logoSRT";

// UTILS
import { inputValidator } from "../../../utils/inputValidator";
import { getUsername } from "../../../utils/localStorage";
import i18n from "../../../utils/i18n";

// STYLE
import style from "../style.css";

let inputUsername = {
  type: "email",
  name: "emailUsername",
  value: getUsername() ? getUsername() : "",
  placeholder: i18n.t("PLACEHOLDER_USER_PASSWORD"),
  required: true,
};

class Auth extends React.Component {
  constructor() {
    super();
    this.state = {
      inputs: {
        emailUsername: inputUsername,
        password: undefined,
      },
      errors: undefined,
      show: true,
    };
  }

  getInput = (input) => {
    let { name, value } = input;
    let { inputs } = this.state;

    this.setState({
      ...this.state,
      inputs: { ...inputs, [name]: value ? input : { value: "" } },
      errors: undefined,
    });
  };

  inputValidator = () => {
    let { inputs } = this.state;
    let { emailUsername, password } = this.state.inputs;
    let { loading, errorInput, authenticate } = this.props;
    let { messageError, errors } = inputValidator(inputs);

    if (errors.length > 0) {
      errorInput(messageError);
      this.setState({
        ...this.state,
        errors,
      });
    } else {
      loading();
      clearMessage();
      authenticate(emailUsername.value, password.value);
    }
  };

  handleKeyPress = (target) => {
    if (target.charCode == 13) {
      this.inputValidator();
    }
  };

  onPopupCloser = () => {
    this.setState({
      ...this.state,
      show: false,
    });
  };

  render() {
    // let userName = getUsername();
    let { user } = this.props;
    let { inputs, errors, show } = this.state;

    return (
      <div onKeyPress={this.handleKeyPress}>
        <div
          style={{
            visibility: show ? "visible" : "hidden",
            opacity: show ? "1" : "0",
          }}
          className={style.overlay}
        >
          <div className={style.popup}>
            <h2>공지사항</h2>
            <span className={style.close} onClick={this.onPopupCloser}>
              &times;
            </span>
            <div className={style.content}>
              <p>안녕하세요.</p>
              <p>SRT 지갑 서비스 이동 공지입니다.</p>
              <p>
                지난 2023년 4월 8일부로 SRT 구매자분들의 Lockup은 모두 해제가 된
                상태입니다. 그간 srt-wallet.io라는 지갑을 개발 및 배포하여
                사용자분들의 편의성을 도모했습니다. 앞서 말씀드린대로 4월
                8일부로 모든 Lockup이 해제되어, 이제는 더이상 자체 지갑의
                필요성이 대폭 감소하게 되었습니다.
              </p>
              <p>
                이에 금일 공지 후 2주간의 유예기간을 거쳐 6월 2일 정오에 기존
                지갑 서비스를 닫을 예정 입니다. 따라서 srt-wallet.io에 있는 모든
                물량은 본인의 거래소 계정 혹은 개인지갑(Metamask, Trust Wallet
                등)으로 출금하여 주시기 바랍니다.
              </p>
              <p>
                유예기간 내에 가급적 모두 출금을 부탁드리며 혹시라도 본 공지를
                접하지 못하셔서 출금을 못하시더라도, 추후에 언제든지
                srt-wallet.io에 고지 드린 이메일로 문의를 주시면 개별적으로
                출금을 도와드리도록 하겠습니다.
              </p>
              <p>많은 협조 부탁드립니다.</p>
              <p>감사합니다.</p>
            </div>
          </div>
        </div>
        <center>
          <LogoSRT medium />
        </center>
        <div className={style.description}>{i18n.t("LOGIN_HEADER")}</div>
        <form autoComplete={"on"}>
          <input
            type="email"
            name="emailUsername"
            autoComplete={"off"}
            required
            value={inputs.emailUsername.value}
            placeholder={i18n.t("PLACEHOLDER_USERNAME_EMAIL")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("emailUsername")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
          <input
            type="password"
            name="password"
            required
            autoComplete={"off"}
            placeholder={i18n.t("PLACEHOLDER_PASSWORD")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("password")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
        </form>

        <Link className={style.textForgetPass} to="/reset">
          {i18n.t("LOGIN_FORGET_PASSWORD_LINK")}
        </Link>

        <button
          className={
            inputs.emailUsername && inputs.password && !errors
              ? style.buttonEnable
              : style.buttonBorderGreen
          }
          onClick={() => {
            this.inputValidator();
          }}
        >
          {user.loading ? <Loading /> : i18n.t("BTN_LOGIN")}
        </button>

        <div className={style.doNotHaveAccount}>
          {i18n.t("LOGIN_CREATE_ACCOUNT_LABEL")}{" "}
          <Link className={style.doNotLink} to="/create">
            {i18n.t("LOGIN_SINGUP_ACCOUNT_LINK")}
          </Link>
        </div>

        <Footer />
      </div>
    );
  }
}

Auth.propTypes = {
  authenticate: PropTypes.func,
  loading: PropTypes.func,
  clearMessage: PropTypes.func,
  errorInput: PropTypes.func,
  user: PropTypes.object,
};

const mapSateToProps = (store) => ({
  user: store.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loading,
      authenticate,
      clearMessage,
      errorInput,
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(Auth);
