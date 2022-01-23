import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FileUploadProgress from "react-fileupload-progress";

//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  kycCreate,
  kycUpload,
  kycGetCountries,
  kycGetStates,
  kycGetCities,
  getKyc
} from "../../redux/settingsAction";

// STYLE
import style from "../../style.css";
import colors from "../../../../components/bases/colors";
import "react-phone-number-input/style.css";

// MATERIAL UI
import {
  Grid,
  Input,
  Select,
  MenuItem,
  Radio,
  FormControlLabel,
  FormControl,
  RadioGroup
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

// UTILS
import i18n from "../../../../utils/i18n";

// ICONS
import { Lens } from "@material-ui/icons";
import Done from "@material-ui/icons/Done";

// COMPONENTS
import Loading from "../../../../components/loading";
import PhoneInput from "react-phone-number-input";
import CountrySelectNative from "./select/countrySelect";
import { parsePhoneNumber } from "libphonenumber-js";
import { parsePhoneNumberFromString as parseMax } from "libphonenumber-js/max";
import ModalBar from "../../../../components/modalBar";
import { CpfMask, CnpjMask } from "../../../../components/inputMask";
import InfoContainer from "../infoContainer";
import InfoConfirm from "../infoCorfirm";

const inputStyle = {
  root: {
    color: colors.messages.info,
    marginBottom: "5px",
    margin: "0",
    padding: "5px",
    width: "calc(100% - 50px)",
    "&:hover:before": {
      borderBottomColor: colors.purple.dark
    }
  },
  rootSelect: {
    padding: "5px"
  },
  rootLabel: {
    fontSize: "11px",
    color: "#fff",
    position: "relative",
    right: "60px",
    top: "2px"
  },
  checked: {
    color: "#68f285"
  },
  rootRadio: {
    color: "#654fa4",
    "&$checked": {
      color: "#68f285"
    },
    margin: "0px 55px 0 1px"
  },
  rootRadioGroup: {
    padding: "5px 3px 0px 2px"
  },
  cssInput: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "17px",
    letterSpacing: "0.5px",
    "&::placeholder": {
      fontSize: "13px"
    }
  },
  cssUnderline: {
    "&:before, &:after": {
      borderBottomColor: colors.purple.dark
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottomColor: `${colors.purple.dark} !important`
    }
  },
  disabled: {
    opacity: "2",
    color: "gray"
  },
  error: {},
  focused: {},
  progressWrapper: {
    height: "5px",
    width: "50px",
    float: "left",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
    WebkitBoxShadow: "inset 0 1px 2px rgba(0,0,0,.1)",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,.1)"
  },
  progressBar: {
    float: "left",
    width: "0",
    height: "100%",
    fontSize: "12px",
    lineHeight: "20px",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#65e986",
    WebkitBoxShadow: "inset 0 -1px 0 rgba(0,0,0,.15)",
    boxShadow: "inset 0 -1px 0 rgba(0,0,0,.15)",
    WebkitTransition: "width .6s ease",
    Otransition: "width .6s ease",
    transition: "width .6s ease"
  },
  cancelButton: {
    WebkitAppearance: "none",
    padding: 0,
    cursor: "pointer",
    background: "0 0",
    border: 0,
    float: "left",
    fontSize: "21px",
    fontWeight: 700,
    lineHeight: 1,
    color: "#f05252"
  },
  sendIcon: {
    float: "left",
    backgroundColor: "transparent",
    border: 0,
    color: "red"
  },
  alignForm: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    backgroundColor: colors.purple.dark,
    borderRadius: "25px",
    padding: "10px"
  },
  inputWithFile: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "25px",
    padding: "10px"
  },
  inputFileWithError: {
    width: "100%",
    backgroundColor: colors.purple.dark,
    borderRadius: "25px",
    padding: "10px",
    border: "1px solid red"
  },
  underline: {
    width: "90%",
    marginBottom: "21px",
    "&:hover": {
      backgroundColor: colors.purple.dark
    },
    "&:before": {
      borderColor: colors.purple.dark
    },
    "&:after": {
      borderColor: colors.purple.dark
    }
  },
  underlineItems: {
    color: "white",
    borderBottomColor: `${colors.green.default} !important`,
    fontSize: "1em",
    width: "100%",
    icon: {
      fill: "green"
    }
  },
  icon: {
    fill: colors.messages.info
  },
  menuItemRoot: {
    color: colors.messages.info
  }
};
class KYC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableButtonUpload: false,
      enableButtonConfirm: false,
      fullName: "",
      street: "",
      state: "",
      city: "",
      zipcode: "",
      document: "",
      phoneNumber: "",
      addressFile: null,
      documentFrontFile: null,
      documentBackFile: null,
      documentSelfieFile: null,
      documentType: "",
      phoneCountry: "",
      invalidPhone: false,
      invalidPassport: false,
      country: "",
      checkInputs: false
    };
  }
  componentDidMount() {
    let { kycGetCountries } = this.props;
    const { getKyc } = this.props;
    kycGetCountries();
    getKyc();
  }

  formGetter() {
    return new FormData(document.getElementByClassName("customForm"));
  }

  uploadImage = (value, fileType) => {
    const { kycUpload } = this.props;
    let reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = function() {
      const payload = {
        fileType: fileType,
        file: reader.result.split(",")[1]
      };

      kycUpload(payload);
    };
  };

  fileUpload = e => {
    if (e.target.files[0]) {
      switch (e.target.name) {
        case "address":
          this.setState({
            addressFile: { file: e.target.files[0], fileType: e.target.name }
          });
          break;
        case "documentFront":
          this.setState({
            documentFrontFile: {
              file: e.target.files[0],
              fileType: e.target.name
            }
          });
          break;
        case "documentBack":
          this.setState({
            documentBackFile: {
              file: e.target.files[0],
              fileType: e.target.name
            }
          });
          break;
        case "documentSelfie":
          this.setState({
            documentSelfieFile: {
              file: e.target.files[0],
              fileType: e.target.name
            }
          });
          break;
      }
    }
  };

  customFormRenderer(onSubmit, value, fileType) {
    let id = fileType + "InputFile";
    let style = this.renderInputFileStyle(fileType);
    return (
      <form className="customForm" style={inputStyle.alignForm}>
        <div style={style}>
          {this.renderFileName(fileType, value)}

          <input
            aria-label
            style={{ display: "none" }}
            type="file"
            id={id}
            onChange={this.fileUpload}
            accept=".png, .pdf, .jpg"
            name={fileType}
          />
        </div>
      </form>
    );
  }
  renderInputFileStyle = fileType => {
    const {
      addressFile,
      documentFrontFile,
      documentBackFile,
      documentSelfieFile,
      checkInputs
    } = this.state;

    if (fileType === "address" && addressFile !== null) {
      return inputStyle.inputWithFile;
    } else if (fileType === "documentFront" && documentFrontFile !== null) {
      return inputStyle.inputWithFile;
    } else if (fileType === "documentBack" && documentBackFile !== null) {
      return inputStyle.inputWithFile;
    } else if (fileType === "documentSelfie" && documentSelfieFile !== null) {
      return inputStyle.inputWithFile;
    } else if (fileType === "address" && addressFile === null && checkInputs) {
      return inputStyle.inputFileWithError;
    } else if (
      fileType === "documentFront" &&
      documentFrontFile === null &&
      checkInputs
    ) {
      return inputStyle.inputFileWithError;
    } else if (
      fileType === "documentBack" &&
      documentBackFile === null &&
      checkInputs
    ) {
      return inputStyle.inputFileWithError;
    } else if (
      fileType === "documentSelfie" &&
      documentSelfieFile === null &&
      checkInputs
    ) {
      return inputStyle.inputFileWithError;
    }
    return inputStyle.input;
  };
  renderFileName = (name, value) => {
    const {
      addressFile,
      documentFrontFile,
      documentBackFile,
      documentSelfieFile
    } = this.state;
    if (addressFile !== null && name === "address") {
      return (
        <div>
          <label style={{ float: "left" }}>
            <img src="images/icons/security/green_clip@2x.png" alt="camera" />
          </label>
          <span style={{ marginLeft: "15px", color: "#000", fontSize: "12px" }}>
            {addressFile.file.name}
          </span>
          <button
            className={style.removeFile}
            onClick={() => {
              this.setState({ addressFile: null });
            }}
          >
            <span>&times;</span>
          </button>
        </div>
      );
    } else if (documentFrontFile !== null && name === "documentFront") {
      return (
        <div>
          <label style={{ float: "left" }}>
            <img src="images/icons/security/green_clip@2x.png" alt="camera" />
          </label>
          <span style={{ marginLeft: "15px", color: "#000", fontSize: "12px" }}>
            {documentFrontFile.file.name}
          </span>
          <button
            className={style.removeFile}
            onClick={() => {
              this.setState({ documentFrontFile: null });
            }}
          >
            <span>&times;</span>
          </button>
        </div>
      );
    } else if (documentBackFile !== null && name === "documentBack") {
      return (
        <div>
          <label style={{ float: "left" }}>
            <img src="images/icons/security/green_clip@2x.png" alt="camera" />
          </label>
          <span style={{ marginLeft: "15px", color: "#000", fontSize: "12px" }}>
            {documentBackFile.file.name}
          </span>
          <button
            className={style.removeFile}
            onClick={() => {
              this.setState({ documentBackFile: null });
            }}
          >
            <span>&times;</span>
          </button>
        </div>
      );
    } else if (documentSelfieFile !== null && name === "documentSelfie") {
      return (
        <div>
          <label style={{ float: "left" }}>
            <img src="images/icons/security/green_clip@2x.png" alt="camera" />
          </label>
          <span style={{ marginLeft: "15px", color: "#000", fontSize: "12px" }}>
            {documentSelfieFile.file.name}
          </span>
          <button
            className={style.removeFile}
            onClick={() => {
              this.setState({ documentSelfieFile: null });
            }}
          >
            <span>&times;</span>
          </button>
        </div>
      );
    }
    return (
      <label htmlFor={name + "InputFile"} style={{ cursor: "pointer" }}>
        <div style={{ float: "left" }}>
          <img src="images/icons/camera/camera@2x.png" alt="camera" />
        </div>
        <span
          style={{ marginLeft: "15px", color: "#654fa4", fontSize: "12px" }}
        >
          {value}
        </span>
      </label>
    );
  };

  customProgressRenderer(progress, hasError) {
    if (hasError || progress > -1) {
      let barStyle = Object.assign({}, inputStyle.progressBar);
      barStyle.width = progress + "%";

      let message = <span>{barStyle.width}</span>;
      if (hasError) {
        barStyle.backgroundColor = "#68f285";
        message = (
          <span style={{ color: "#f05252" }}>
            {i18n.t("TEXT_FAILED_UPLOAD")}
          </span>
        );
      }
      if (progress === 100) {
        message = (
          <div
            style={{
              display: "flex",
              color: "#68f285"
            }}
          >
            <span>
              <Done />
            </span>
          </div>
        );
      }

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={inputStyle.sendIcon}>
            <span>
              <img
                src="images/icons/security/anexo@1x.png"
                style={{ width: "12px" }}
              />
            </span>
          </button>
          <div style={inputStyle.progressWrapper}>
            <div style={barStyle} />
          </div>
          <button style={inputStyle.cancelButton}>
            <span>&times;</span>
          </button>
          <div style={{ clear: "left" }}>{message}</div>
        </div>
      );
    } else {
      return;
    }
  }

  renderComponents = () => {
    const { kyc } = this.props;
    const imgUrl = "images/icons/security/kyc_documentConfirm.png";
    if (kyc.status === "waiting") {
      return (
        <InfoContainer
          imageUrl={imgUrl}
          title={i18n.t("KYC_INFOCONTAINER_TITLE")}
          description={i18n.t("KYC_INFOCONTAINER_TEXT")}
        />
      );
    } else if (kyc.status === "confirmed") {
      return (
        <InfoConfirm
          title={i18n.t("KYC_INFOCONFIRM_TITLE")}
          description={i18n.t("KYC_INFOCONFIRM_TEXT")}
        />
      );
    } else {
      return this.renderKycForm();
    }
  };

  renderKycForm = () => {
    const {
      classes,
      loadingKyc,
      loadingCreate,
      loadingState,
      loadingCity
    } = this.props;
    const {
      phoneNumber,
      documentType,
      invalidPassport,
      invalidPhone,
      country,
      state,
      city,
      checkInputs
    } = this.state;
    const MenuProps = {
      PaperProps: {
        style: {
          color: "#fff",
          maxHeight: 40 * 4.5,
          marginTop: "45px",
          backgroundColor: "#473088",
          width: "10%"
        }
      }
    };
    let inputMask = null;
    if (documentType === "cnpj") {
      inputMask = CnpjMask;
    } else if (documentType === "cpf") {
      inputMask = CpfMask;
    }
    let isCnpj = documentType === "cnpj";
    return (
      <Grid item xs={12} sm={12} className={style.wrapperKYC}>
        <Grid container className={style.contentKYC}>
          <Grid container className={style.boxKYC_1}>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("KYC_FULL_NAME")}</p>
              <div className={style.textInput}>
                <Input
                  value={this.state.fullName}
                  onChange={this.handleInput("fullName")}
                  classes={{
                    root: classes.root,
                    underline: classes.cssUnderline,
                    input: classes.cssInput
                  }}
                  error={checkInputs && this.state.fullName === ""}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid item xs={10} sm={10} md={10}>
                <p>Telefone</p>
                <PhoneInput
                  placeholder=""
                  inputClassName={
                    invalidPhone ||
                    (checkInputs && this.state.phoneNumber === "")
                      ? style.inputTextPhoneError
                      : style.inputTextPhone
                  }
                  countrySelectComponent={CountrySelectNative}
                  value={phoneNumber}
                  onChange={phoneNumber => this.handlePhoneNumber(phoneNumber)}
                  onCountryChange={phoneCountry =>
                    this.setState({ phoneCountry })
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("SETTINGS_USER_ADDRESS")}</p>
              <div className={style.textInput}>
                <Input
                  value={this.state.street}
                  onChange={this.handleInput("street")}
                  classes={{
                    root: classes.root,
                    underline: classes.cssUnderline,
                    input: classes.cssInput
                  }}
                  error={checkInputs && this.state.street === ""}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("SETTINGS_USER_ZIP_CODE")}</p>
              <div className={style.textInput}>
                <Input
                  classes={{
                    root: classes.root,
                    underline: classes.cssUnderline,
                    input: classes.cssInput
                  }}
                  value={this.state.zipcode}
                  error={checkInputs && this.state.zipcode === ""}
                  onChange={this.handleInput("zipcode")}
                  inputProps={{ maxLength: "12" }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container className={style.boxKYC_2}>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("SETTINGS_USER_COUNTRY")}</p>
              <div className={style.textInput}>
                <Select
                  classes={{
                    selectMenu: classes.underlineItems,
                    root: classes.rootSelect
                  }}
                  value={country}
                  MenuProps={MenuProps}
                  input={
                    <Input
                      classes={{
                        underline: classes.underline
                      }}
                    />
                  }
                  inputProps={{
                    classes: {
                      icon: classes.icon
                    }
                  }}
                  onChange={this.handleInput("country")}
                  error={checkInputs && this.state.country === ""}
                >
                  {this.listCountries()}
                </Select>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("SETTINGS_USER_STATE")}</p>
              <div className={style.textInput}>
                {loadingState ? (
                  <Loading />
                ) : (
                  <Select
                    classes={{
                      selectMenu: classes.underlineItems,
                      root: classes.rootSelect
                    }}
                    value={state}
                    MenuProps={MenuProps}
                    input={
                      <Input
                        classes={{
                          underline: classes.underline
                        }}
                      />
                    }
                    inputProps={{
                      classes: {
                        icon: classes.icon
                      }
                    }}
                    disabled={country !== "" ? false : true}
                    onChange={this.handleInput("state")}
                    error={checkInputs && this.state.state === ""}
                  >
                    {this.listStates()}
                  </Select>
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <p>{i18n.t("SETTINGS_USER_CITY")}</p>
              <div className={style.textInput}>
                {loadingCity ? (
                  <Loading />
                ) : (
                  <Select
                    classes={{
                      selectMenu: classes.underlineItems,
                      root: classes.rootSelect
                    }}
                    value={city}
                    MenuProps={MenuProps}
                    input={
                      <Input
                        classes={{
                          underline: classes.underline
                        }}
                      />
                    }
                    inputProps={{
                      classes: {
                        icon: classes.icon
                      }
                    }}
                    disabled={state !== "" ? false : true}
                    onChange={this.handleInput("city")}
                    error={checkInputs && this.state.city === ""}
                  >
                    {this.listCities()}
                  </Select>
                )}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              style={{ padding: "15px 25px 0 0" }}
            >
              {loadingKyc ? (
                <Loading />
              ) : (
                <FileUploadProgress
                  isRequired
                  id="fileupkeyload"
                  key="ex1"
                  url=""
                  error={true}
                  onProgress={(e, request, progress) => {
                    console.warn("progress", e, request, progress);
                  }}
                  onLoad={(e, request) => {
                    console.warn("load", e, request);
                  }}
                  onError={(e, request) => {
                    console.warn("error", e, request);
                  }}
                  onAbort={(e, request) => {
                    console.warn("abort", e, request);
                  }}
                  formGetter={this.formGetter.bind(this)}
                  formRenderer={e =>
                    this.customFormRenderer(
                      e,
                      i18n.t("KYC_UPLOAD_ADDRESS"),
                      "address"
                    )
                  }
                  progressRenderer={this.customProgressRenderer.bind(this)}
                />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item className={style.contentKYC_2}>
          <Grid container className={style.boxKYC_1}>
            <Grid item xs={12}>
              <p>{i18n.t("SECURITY_INSERT_DOC")}</p>
              <div className={style.textInput}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl
                    component="fieldset"
                    className={style.labelRadio}
                  >
                    <RadioGroup
                      aria-label="Documentos"
                      name="documentos"
                      value={documentType}
                      onChange={this.handleRadioChange}
                      row={true}
                      classes={{ root: classes.rootRadioGroup }}
                    >
                      <FormControlLabel
                        value="cpf"
                        control={
                          <Radio
                            icon={<Lens />}
                            checkedIcon={<Lens />}
                            classes={{
                              root: classes.rootRadio,
                              checked: classes.checked
                            }}
                          />
                        }
                        label="CPF"
                        classes={{ label: classes.rootLabel }}
                      />
                      <FormControlLabel
                        value="cnpj"
                        control={
                          <Radio
                            icon={<Lens />}
                            checkedIcon={<Lens />}
                            classes={{
                              root: classes.rootRadio,
                              checked: classes.checked
                            }}
                          />
                        }
                        label="CNPJ"
                        classes={{ label: classes.rootLabel }}
                      />
                      <FormControlLabel
                        value="passport"
                        control={
                          <Radio
                            icon={<Lens />}
                            checkedIcon={<Lens />}
                            classes={{
                              root: classes.rootRadio,
                              checked: classes.checked
                            }}
                          />
                        }
                        label={i18n.t("KYC_PASSPORT")}
                        classes={{ label: classes.rootLabel }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Input
                  placeholder={i18n.t("KYC_DOCUMENT_PLACEHOLDER")}
                  className={style.inputText}
                  value={this.state.document}
                  onChange={this.handleInput("document")}
                  classes={{
                    root: classes.root,
                    underline: classes.cssUnderline,
                    input: classes.cssInput,
                    disabled: classes.disabled
                  }}
                  error={
                    invalidPassport ||
                    (checkInputs && this.state.document === "")
                  }
                  disabled={documentType ? false : true}
                  inputComponent={inputMask}
                />
              </div>
            </Grid>
          </Grid>
          <Grid item className={!isCnpj ? style.displayBox_3 : null}>
            <Grid item xs={12} lg={isCnpj ? 12 : 4} className={style.boxKYC_3}>
              {loadingKyc ? (
                <Loading />
              ) : (
                <FileUploadProgress
                  isRequired
                  id="fileupload"
                  key="ex2"
                  url=""
                  onProgress={(e, request, progress) => {
                    console.warn("progress", e, request, progress);
                  }}
                  onLoad={(e, request) => {
                    console.warn("load", e, request);
                  }}
                  onError={(e, request) => {
                    console.warn("error", e, request);
                  }}
                  onAbort={(e, request) => {
                    console.warn("abort", e, request);
                  }}
                  formGetter={this.formGetter.bind(this)}
                  formRenderer={e =>
                    this.customFormRenderer(
                      e,
                      isCnpj
                        ? i18n.t("KYC_UPLOAD_SOCIAL_CONTRACT")
                        : i18n.t("KYC_UPLOAD_FRONT"),
                      "documentFront"
                    )
                  }
                  progressRenderer={this.customProgressRenderer.bind(this)}
                />
              )}
            </Grid>
            <Grid item xs={12} lg={4} className={style.boxKYC_3}>
              {loadingKyc ? (
                <Loading />
              ) : isCnpj ? null : (
                <FileUploadProgress
                  isRequired
                  id="fileupload"
                  key="ex3"
                  url=""
                  onProgress={(e, request, progress) => {
                    console.warn("progress", e, request, progress);
                  }}
                  onLoad={(e, request) => {
                    console.warn("load", e, request);
                  }}
                  onError={(e, request) => {
                    console.warn("error", e, request);
                  }}
                  onAbort={(e, request) => {
                    console.warn("abort", e, request);
                  }}
                  formGetter={this.formGetter.bind(this)}
                  formRenderer={e =>
                    this.customFormRenderer(
                      e,
                      i18n.t("KYC_UPLOAD_BACK"),
                      "documentBack"
                    )
                  }
                  progressRenderer={this.customProgressRenderer.bind(this)}
                />
              )}
            </Grid>
            <Grid item xs={12} lg={4} className={style.boxKYC_3}>
              {loadingKyc ? (
                <Loading />
              ) : isCnpj ? null : (
                <FileUploadProgress
                  isRequired
                  id="fileupload"
                  key="ex4"
                  url="http://localhost:6000/api/upload"
                  onProgress={(e, request, progress) => {
                    console.warn("progress", e, request, progress);
                  }}
                  onLoad={(e, request) => {
                    console.warn("load", e, request);
                  }}
                  onError={(e, request) => {
                    console.warn("error", e, request);
                  }}
                  onAbort={(e, request) => {
                    console.warn("abort", e, request);
                  }}
                  formGetter={this.formGetter.bind(this)}
                  formRenderer={e =>
                    this.customFormRenderer(
                      e,
                      i18n.t("KYC_UPLOAD_SELFIE"),
                      "documentSelfie"
                    )
                  }
                  progressRenderer={this.customProgressRenderer.bind(this)}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <center>
            <Grid item xs={12} sm={6}>
              {this.checkAllInputs() ? (
                <button
                  className={style.buttonEnableSecurity}
                  onClick={() => this.handleClick()}
                >
                  {loadingCreate ? <Loading /> : i18n.t("BTN_CONFIRM")}
                </button>
              ) : (
                <a href="#requiredFields" style={{ textDecoration: "none" }}>
                  <button
                    className={style.buttonDisabledSecurity}
                    onClick={() => this.setState({ checkInputs: !checkInputs })}
                  >
                    {i18n.t("BTN_CONFIRM")}
                  </button>
                </a>
              )}
            </Grid>
          </center>
        </Grid>
      </Grid>
    );
  };

  listCountries = () => {
    const { classes, countries } = this.props;

    return countries.map((item, index) => (
      <MenuItem
        value={item.shortName}
        key={index}
        classes={{
          root: classes.menuItemRoot
        }}
      >
        {item.name}
      </MenuItem>
    ));
  };
  listStates = () => {
    const { classes, states } = this.props;
    if (states) {
      return states.map((item, index) => (
        <MenuItem
          value={item}
          key={index}
          classes={{
            root: classes.menuItemRoot
          }}
        >
          {item}
        </MenuItem>
      ));
    }
    return "";
  };
  listCities = () => {
    const { classes, city } = this.props;
    if (city) {
      return city.map((item, index) => (
        <MenuItem
          value={item}
          key={index}
          classes={{
            root: classes.menuItemRoot
          }}
        >
          {item}
        </MenuItem>
      ));
    }
    return "";
  };

  handleInput = property => e => {
    const { kycGetStates, kycGetCities } = this.props;
    const { documentType, country } = this.state;
    let value = e.target.value;
    let location = {};
    switch (property) {
      case "document":
        if (documentType === "passport") {
          value = value.replace(/[^A-Z0-9]/, "");
          if (value.length < 10) {
            this.setState({
              [property]: value
            });
          }
        } else {
          this.setState({
            [property]: value
          });
        }
        break;
      case "country":
        this.setState({
          [property]: value
        });
        kycGetStates(value);
        this.setState({ state: "" });
        this.setState({ city: "" });
        break;
      case "state":
        location = {
          country: country,
          state: value
        };
        this.setState({
          [property]: value
        });
        kycGetCities(location);
        this.setState({ city: "" });
        break;
      case "zipcode":
        value = value.replace(/\W/, "");
        this.setState({
          [property]: value
        });
        break;
      default:
        this.setState({
          [property]: value
        });
        break;
    }
  };

  handlePhoneNumber = phone => {
    const { phoneCountry } = this.state;
    let parseNumber;
    try {
      parseNumber = parsePhoneNumber(phone, phoneCountry);
    } catch (error) {
      parseNumber = "";
    }
    this.setState({ phoneNumber: parseNumber.number });
  };

  handleRadioChange = event => {
    this.setState({ documentType: event.target.value, document: "" });
  };

  checkAllInputs = () => {
    const {
      street,
      state,
      city,
      zipcode,
      fullName,
      document,
      documentType,
      phoneNumber,
      addressFile,
      documentFrontFile,
      documentBackFile,
      documentSelfieFile
    } = this.state;
    if (documentType === "cnpj") {
      return (
        street &&
        state &&
        city &&
        zipcode &&
        fullName &&
        document &&
        phoneNumber &&
        addressFile &&
        documentFrontFile
      );
    }
    return (
      street &&
      state &&
      city &&
      zipcode &&
      fullName &&
      document &&
      phoneNumber &&
      addressFile &&
      documentFrontFile &&
      documentBackFile &&
      documentSelfieFile
    );
  };

  handleClick = () => {
    const { kycCreate } = this.props;
    const {
      street,
      state,
      city,
      zipcode,
      fullName,
      document,
      phoneNumber,
      documentType,
      addressFile,
      documentFrontFile,
      documentBackFile,
      documentSelfieFile,
      country
    } = this.state;
    const payload = {
      fullName,
      document,
      documentType,
      phoneNumber,
      address: {
        street,
        city,
        state,
        country,
        zipcode
      }
    };
    let passport = new RegExp("^[A-Z][0-9]{8}$");

    if (!parseMax(phoneNumber).isValid()) {
      this.setState({ invalidPhone: true });
    } else {
      this.setState({ invalidPhone: false });
    }

    if (document.match(passport) === null && documentType === "passport") {
      this.setState({ invalidPassport: true });
    } else {
      this.setState({ invalidPassport: false });
    }
    if (!this.state.invalidPassport && !this.state.invalidPhone) {
      this.uploadImage(addressFile.file, addressFile.fileType);
      this.uploadImage(documentFrontFile.file, documentFrontFile.fileType);
      this.uploadImage(documentBackFile.file, documentBackFile.fileType);
      this.uploadImage(documentSelfieFile.file, documentSelfieFile.fileType);
      kycCreate(payload);
    }
  };

  render() {
    const { invalidPassport, invalidPhone, checkInputs } = this.state;
    const { sendRequest } = this.props;
    let errorMessage = "";
    if (invalidPassport && !invalidPhone)
      errorMessage = i18n.t("KYC_INVALID_PASSPORT");
    else if (invalidPhone && !invalidPassport)
      errorMessage = i18n.t("KYC_INVALID_PHONE");
    else if (invalidPassport && invalidPhone)
      errorMessage = i18n.t("KYC_INVALID_PASSPORT_PHONE");
    return (
      <div>
        {invalidPassport || invalidPhone ? (
          <ModalBar type="error" message={errorMessage} timer />
        ) : null}
        {sendRequest === 2 ? (
          <ModalBar
            type="success"
            message={i18n.t("SEND_MAIL_INVITE_SUCCESS")}
            timer
          />
        ) : null}
        <Grid container className={style.containerHeaderSettings}>
          <Grid item xs={12} className={style.headerSettingsDefault}>
            <Hidden smUp>
              <Grid item xs={12}>
                <h3>{i18n.t("TITLE_SECURITY_3")} </h3>
              </Grid>
            </Hidden>
            <Grid item sm={2} />

            <Grid item xs={6} sm={2}>
              <Link to="security">
                <p>{i18n.t("SECURITY_USER_BACK")}</p>
              </Link>
            </Grid>
            <Hidden xsDown>
              <Grid item xs={12} sm={3}>
                <h3>{i18n.t("TITLE_SECURITY_3")}</h3>
              </Grid>
            </Hidden>

            <Grid item xs={10} sm={6} id={"hr"}>
              <hr />
            </Grid>
          </Grid>
        </Grid>

        <div className={style.containerSecurity}>
          <Grid item xs={11} sm={8}>
            <Grid container className={style.allSecurity}>
              <Grid item xs={12} className={style.containerItems}>
                <Grid item xs={12} className={style.counterItemsKYC}>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"1"} <p>{i18n.t("KYC_STEP_1")}</p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"2"} <p> {i18n.t("KYC_STEP_2")} </p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"3"} <p>{i18n.t("KYC_STEP_3")}</p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={style.containerKYC}>
                {checkInputs ? (
                  <span style={{ color: "red" }} id="requiredFields">
                    {i18n.t("KYC_CHECK_INPUT")}{" "}
                  </span>
                ) : null}
                {this.renderComponents()}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

KYC.propTypes = {
  classes: PropTypes.object.isRequired,
  kycCreate: PropTypes.func.isRequired,
  kycUpload: PropTypes.func.isRequired,
  loadingKyc: PropTypes.bool.isRequired,
  loadingCreate: PropTypes.bool.isRequired,
  loadingState: PropTypes.bool.isRequired,
  loadingCity: PropTypes.bool.isRequired,
  kycGetCountries: PropTypes.func.isRequired,
  kycGetStates: PropTypes.func.isRequired,
  kycGetCities: PropTypes.func.isRequired,
  countries: PropTypes.array,
  states: PropTypes.array,
  city: PropTypes.array,
  sendRequest: PropTypes.number,
  getKyc: PropTypes.func,
  kyc: PropTypes.object.isRequired
};

const mapStateToProps = store => ({
  loadingKyc: store.settings.loadingKyc,
  loadingCreate: store.settings.loadingCreate,
  loadingState: store.settings.loadingState,
  loadingCity: store.settings.loadingCity,
  countries: store.settings.location.countries,
  states: store.settings.location.states,
  city: store.settings.location.city,
  sendRequest: store.settings.sendRequest,
  kyc: store.settings.kyc
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      kycCreate,
      kycUpload,
      kycGetCountries,
      kycGetStates,
      kycGetCities,
      getKyc
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(inputStyle)(KYC));
