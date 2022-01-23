import React from "react";
import PropTypes from "prop-types";

// STYLE
import style from "./style.css";

//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setTabIcon } from "../../redux/p2pAction";
import { errorInput } from "../../../errors/redux/errorAction";

//UTILS
import i18n from "../../../../utils/i18n";

class TabIcons extends React.Component {
  constructor(props) {
    super(props);
  }

  handleIcon = key => {
    const { setTabIcon, mySignature, errorInput } = this.props;

    if (key == 3 && mySignature == undefined) {
      errorInput(i18n.t("P2P_SIGNATURE_ACTIVE"));
      return;
    } else {
      setTabIcon(key);
    }
  };

  render() {
    const { content } = this.props;
    const { tabIcon } = this.props.p2pStore;

    return (
      <div className={style.baseTab}>
        {content.map((val, key) => {
          let open;
          let icon_img;
          if (key == tabIcon) {
            open = style.itemTabActive;
            icon_img = val;
          } else {
            open = style.itemTab;
            icon_img = val + "-purple";
          }

          return (
            <div
              key={key}
              onClick={() => this.handleIcon(key)}
              className={open}
            >
              <img src={`images/icons/p2p/${icon_img}.png`} />
            </div>
          );
        })}
      </div>
    );
  }
}

TabIcons.propTypes = {
  content: PropTypes.array.isRequired,
  handle: PropTypes.func.isRequired,
  p2pStore: PropTypes.object,
  setTabIcon: PropTypes.func,
  errorInput: PropTypes.func,
  mySignature: PropTypes.object
};

const mapStateToProps = store => ({
  p2pStore: store.p2p,
  mySignature: store.settings.mySignature
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setTabIcon,
      errorInput
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabIcons);
