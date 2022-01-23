import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getProfile,
  clearUserProfile,
  setUserDescription
} from "../redux/p2pAction";

//MATERIAL
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";

// COMPONENTS
import StarVotes from "../components/starvotes";
import Loading from "../../../components/loading";
//import ModalBar from "../../../components/modalBar";

// styles
import style from "../style.css";
import colors from "../../../components/bases/colors";

// UTILS
import i18n from "../../../utils/i18n";
import { formatDate, percentCalc } from "../../../utils/numbers";
import { encryptMd5 } from "../../../utils/cryptography";

const styles = {
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: colors.purple.dark
  },
  barColorPrimary: {
    backgroundColor: colors.green.default
  }
};
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positivePercents: 0,
      isEditabled: false,
      description: ""
    };
  }

  componentDidMount = () => {
    const { clearUserProfile, getProfile, userProfile } = this.props;
    if (!userProfile.id) getProfile();

    clearUserProfile();
  };

  rederPictureGravatar(email) {
    if (email) {
      const defaultImg =
        "https://luneswallet.app/images/icons/p2p/lunio-user300x300.jpg";
      return (
        "https://s.gravatar.com/avatar/" +
        encryptMd5(email.toLowerCase()) +
        "?s=300" +
        "&d=" +
        defaultImg
      );
    }
  }

  calcPercentagePositive = (positiveTransactions, amountTransactions) =>
    positiveTransactions > 0
      ? percentCalc(positiveTransactions, amountTransactions)
      : 0;

  renderEvaluation = () => {
    const { evaluation } = this.props.profile;
    if (evaluation && evaluation.length) {
      return evaluation.map((item, key) => (
        <div key={key} className={style.userFeedback}>
          <span className={style.spanDescription}>
            {`${item.name} ${item.surname}`}
          </span>
          <div className={style.feedbackBox}>
            <StarVotes votes={item.value} />
          </div>
          <div className={style.textDescription}>
            <p>{item.description}</p>
          </div>
        </div>
      ));
    }
    return <div />;
  };

  handleInputState = () => {
    const { isEditabled } = this.state;
    this.setState({ isEditabled: !isEditabled });
  };

  handleFields = e => {
    const { value } = e.target;
    if (value) this.setState({ description: value });
    else this.setState({ description: null });
  };

  handleEvent = e => {
    if (e.key === "Enter") this.sendDescription();
  };

  sendDescription = () => {
    const { description } = this.state;
    const { setUserDescription, profile } = this.props;

    if (description) profile.description = description;
    setUserDescription(profile);
    this.handleInputState();
  };

  renderEditIcon = () => {
    const { isEditabled } = this.state;
    const { profile, userEmail } = this.props;
    const isUserLogged = profile.email === userEmail;
    if (isEditabled && isUserLogged)
      return <EditIcon onClick={() => this.sendDescription()} />;
    else if (isUserLogged)
      return <EditIcon onClick={() => this.handleInputState()} />;
  };

  renderDescriptionInput = () => {
    const { isEditabled } = this.state;
    const { profile } = this.props;
    let { description } = profile;

    if (isEditabled) {
      return (
        <Grid item xs={12}>
          <textarea
            className={style.textArea}
            name="description"
            placeholder={i18n.t("P2P_USER_DESCRIPTION")}
            onChange={e => this.handleFields(e)}
            onKeyPress={this.handleEvent}
            maxLength="250"
            defaultValue={description}
          />
        </Grid>
      );
    } else {
      return (
        <div className={style.textDescription}>
          <p>{profile.description}</p>
        </div>
      );
    }
  };

  render() {
    let positivePercents = 0;
    const { classes, loading, profile } = this.props;
    const { rating } = profile;
    const dateCreate = formatDate(profile.createdAt);
    if (rating)
      positivePercents = this.calcPercentagePositive(
        rating.positive,
        rating.count
      );

    if (loading) return <Loading color="lunes" margin={"50% 0% 0% 0%"} />;

    return (
      <Grid container className={style.baseUserProfile}>
        <Grid item xs={12} sm={12}>
          <div className={style.cardProfile}>
            <div className={style.userInfo}>
              {profile && (
                <img
                  src={this.rederPictureGravatar(profile.email)}
                  alt="profile"
                  className={style.avatarProfile}
                />
              )}
              <div className={style.userName}>
                {profile.name} {profile.surname}
                <br />{" "}
                <div className={style.boxStar}>
                  {rating && <StarVotes votes={rating.average} />}
                </div>
                {profile && (
                  <span className={style.textSmall}>
                    {i18n.t("P2P_PROFILE_USER_DATE")} {dateCreate}
                  </span>
                )}
              </div>{" "}
              <br />
            </div>
            <div className={style.userDescription}>
              <span className={style.spanDescription}>
                {i18n.t("P2P_PROFILE_DESCRIPTION")}
              </span>
              {/* <div className={style.textDescription}>
                 <p>{profile.description}</p> 
               
              </div> */}
              {this.renderDescriptionInput()}
              <div className={style.editButton}>
                <div style={{ position: "absolute" }}>
                  {this.renderEditIcon()}
                </div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <div className={style.cardProfile}>
            <div className={style.data}>
              <span className={style.spanDescription}>
                {i18n.t("P2P_PROFILE_DATA")}
              </span>
              <div className={style.hr} />
            </div>

            <div className={style.bars}>
              <span className={style.spanBars}>
                {i18n.t("P2P_PROFILE_NEGOTIATIONS")}
              </span>

              <div className={style.barsNumbers}>
                <span>{rating ? rating.count : 0}</span>
              </div>
            </div>
            <LinearProgress
              className={style.bar}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary
              }}
              value={100}
              variant="determinate"
            />

            <div className={style.bars}>
              <span className={style.spanBars}>
                {i18n.t("P2P_PROFILE_CONCLUDED")}
              </span>

              <div className={style.barsNumbers}>
                <span>{positivePercents}%</span>
              </div>
            </div>
            <LinearProgress
              className={style.bar}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary
              }}
              value={positivePercents}
              variant="determinate"
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <div className={style.cardProfileLast}>
            <div className={style.data}>
              <span className={style.spanDescription}>
                {i18n.t("P2P_PROFILE_FEEDBACK")}
              </span>
              <div className={style.hr} />
            </div>
            {this.renderEvaluation()}
          </div>
        </Grid>
      </Grid>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  getProfile: PropTypes.func,
  userProfile: PropTypes.array,
  profile: PropTypes.object,
  clearUserProfile: PropTypes.func,
  loading: PropTypes.bool,
  userEmail: PropTypes.string,
  setUserDescription: PropTypes.func
};

const mapStateToProps = store => ({
  userProfile: store.p2p.userProfile,
  profile: store.p2p.profile,
  userEmail: store.user.user.email,
  loading: store.p2p.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getProfile,
      clearUserProfile,
      setUserDescription
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserProfile));
