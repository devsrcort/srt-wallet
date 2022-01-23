import React from "react";
import PropTypes from "prop-types";
import i18n from "../../../../utils/i18n";
import style from "../../style.css";
import Grid from "@material-ui/core/Grid";

class InfoContainer extends React.Component {
  render() {
    const { imageUrl, title, description } = this.props;

    return <div>
        <Grid>
          <Grid container>
            <Grid item sm={3} xs={3}>
              <img src={imageUrl} alt={i18n.t("KYC_INFOCONTAINER_IMG")} />
            </Grid>

            <Grid item sm={6} xs={8} className={style.infoBoxText}>
              <h1 className={style.infoTitle}>{title}</h1>

              <Grid>
                <span className={style.infoText}>{description}</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>;
  }
}

InfoContainer.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
}

export default InfoContainer;
