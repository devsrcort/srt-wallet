import React from "react";
import PropTypes from "prop-types";
import i18n from "../../../../utils/i18n";
import style from "../../style.css";
import Grid from "@material-ui/core/Grid";

class infoConfirm extends React.Component {
  render() {
    const { title, description } = this.props;

    return (
      <div>
        <Grid>
          <Grid container style={{ marginBottom: "25px" }}>
            <Grid item sm={3} xs={3}>
              <img
                src="/images/settings/kyc_infoConfirm.png"
                alt={i18n.t("KYC_INFOCONFIRM_IMG")}
                className={style.infoConfirmImg}
              />
            </Grid>

            <Grid item sm={6} xs={8} className={style.infoConfirmBoxText}>
              <h1 className={style.infoConfirmTitle}>{title}</h1>

              <Grid>
                <span className={style.infoConfirmText}>{description}</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

infoConfirm.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default infoConfirm;
