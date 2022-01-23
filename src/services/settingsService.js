import axios from "axios";

// CONSTANTS
import { BASE_URL, API_HEADER, HEADER_RESPONSE } from "../constants/apiBaseUrl";

// ERROS
import { internalServerError } from "../containers/errors/statusCodeMessage";

// UTILS
import { setAuthToken } from "../utils/localStorage";

class SettingsService {
  async kycCreate(token, payload) {
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/kyc`,
        payload.payload,
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async kycUpload(token, payload) {
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/kyc/upload`,
        payload.upload,
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }
  async kycGetCountries(token){
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/util/countrystatecity`,
        {
        method:"listcountries",
        },
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async kycGetStates(token, country){
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/util/countrystatecity`,
        {
        method:"liststates",
        params:{
          country
        }
        },
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async kycGetCity(token, country, state){
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/util/countrystatecity`,
        {
        method:"listcities",
        params:{
          country,
          state
        }
        },
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }
  async getSignatures(token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.get(BASE_URL + "/signature/plan", API_HEADER);
      setAuthToken(response.headers[HEADER_RESPONSE]);
      if (response.data.code !== 200) {
        return internalServerError();
      }
      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async getSignature(token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.get(BASE_URL + "/signature", API_HEADER);
      setAuthToken(response.headers[HEADER_RESPONSE]);
      if (response.data.code !== 200) {
        return internalServerError();
      }
      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async signSignature(token, payload) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.post(
        BASE_URL + "/signature",
        payload,
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response;
    } catch (error) {
      internalServerError();
      return;
    }
  }
  async getKyc(token) {
    try {
      API_HEADER.headers.Authorization = token;
      const request = `${BASE_URL}/kyc`;
      let response = await axios.get(request, API_HEADER);
      
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response;
    } catch (error) {
      return internalServerError();
    }
  }
}

export default SettingsService;
