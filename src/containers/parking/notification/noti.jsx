import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loading } from "../redux/parkingAction";
import { clearMessage, errorInput } from "../../errors/redux/errorAction";

// COMPONENTS
import LogoSRT from "../../../components/logoSRT";
import Footer from "../footer";

// UTILS
import { inputValidator } from "../../../utils/inputValidator";
import { getUsername } from "../../../utils/localStorage";
import i18n from "../../../utils/i18n";

// STYLE
import style from "../style.css";

let inputUsername = {
  type: "name",
  name: "userName",
  value: "",
  placeholder: i18n.t("PLACEHOLDER_USERNAME"),
  required: true,
};

let inputEmail = {
    type: "email",
    name: "email",
    value: "",
    placeholder: i18n.t("PLACEHOLDER_USERNAME_EMAIL"),
    required: true,
};

let inputAddress = {
    type: "address",
    name: "address",
    value: "",
    placeholder: i18n.t("PLACEHOLDER_ADDRESS"),
    required: true,
};

let inputMessage = {
    type: "message",
    name: "message",
    value: "",
    placeholder: i18n.t("PLACEHOLDER_MESSEGE"),
    required: true,
};


class Noti extends React.Component {
  constructor() {
    super();
    this.state = {
        inputs: {
          userName: inputUsername,
          email: inputEmail,
          address: inputAddress,
          message: inputMessage,
        },
        errors: undefined,
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
    let { userName, email, address, message } = this.state.inputs;
    let { errorInput } = this.props;
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
    }
  };

  handleKeyPress = (target) => {
    if (target.charCode == 13) {
      this.inputValidator();
    }
  };

  render() {
    let { inputs, errors } = this.state;

    return (
      <div onKeyPress={this.handleKeyPress}>
        <center>
          <LogoSRT medium />
        </center>
        <div>
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
                아래 폼에 지갑 관련 정보를 기입해주시면 일괄 처리하여 <br/> SRT 전송을 진행하겠습니다.
                <br/><br/>폼 기입은 6/3 부터 가능합니다. 
              </p>
              <p>많은 협조 부탁드립니다.</p>
              <p>감사합니다.</p>
            </div>
          </div>
        <form autoComplete={"on"}>
        <input
            type="userName"
            name="userName"
            autoComplete={"off"}
            required
            value={inputs.userName.value}
            placeholder={i18n.t("PLACEHOLDER_USERNAME")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("userName")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
        <input
            type="email"
            name="email"
            autoComplete={"off"}
            required
            value={inputs.email.value}
            placeholder={i18n.t("PLACEHOLDER_USED_EMAIL")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("email")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
        <input
            type="address"
            name="address"
            autoComplete={"off"}
            required
            value={inputs.address.value}
            placeholder={i18n.t("PLACEHOLDER_ADDRESS")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("address")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
        <input
            type="message"
            name="message"
            autoComplete={"off"}
            required
            value={inputs.message.value}
            placeholder={i18n.t("PLACEHOLDER_MESSEGE")}
            onChange={(event) => {
              this.getInput(event.target);
            }}
            className={
              errors && errors.includes("message")
                ? style.inputTextError
                : style.inputTextDefault
            }
          />
        </form>

        <button
          className={
            inputs.userName && inputs.email && inputs.address && inputs.message && !errors
              ? style.buttonEnable
              : style.buttonBorderGreen
          }
          onClick={() => {
            // this.inputValidator();
            alert(i18n.t("NOTI_AVAIL_SEND_MAIL"));
          }}
        >
          {i18n.t("BTN_SEND")}
        </button>

        <Footer />
      </div>
    );
  }
}

Noti.propTypes = {
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
      clearMessage,
      errorInput,
    },
    dispatch
  );

export default connect(mapSateToProps, mapDispatchToProps)(Noti);
