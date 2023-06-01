import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// COMPONENT
import Noti from "./noti";

// STYLE
import style from "../style.css";

class Notification extends React.Component {
  render() {
    return <div className={style.contGeneral} >
        <Noti />
      </div>;
  }
}

Notification.propTypes = {
  pages: PropTypes.object
};

const mapSateToProps = store => ({
  pages: store.user.pages
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(Notification);
