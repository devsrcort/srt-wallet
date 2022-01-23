import axios from "axios";

// CONSTANTS
import { BASE_URL, API_HEADER, HEADER_RESPONSE } from "../constants/apiBaseUrl";

// ERROS
import { internalServerError } from "../containers/errors/statusCodeMessage";

// UTILS
import { setAuthToken } from "../utils/localStorage";

class InviteService {
  async getInviteHistory(token) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(BASE_URL + "/invite/history?page=1&size=100", API_HEADER);
      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async sendEmail(token, email) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.post(
        BASE_URL + "/invite/email",
        {
          email: email.email
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async getInvite(token) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(BASE_URL + "/invite/consult", API_HEADER);

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async getInviteBalance(token, address) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        `${BASE_URL}/invite/balance/${address.link}`,
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async sendWithdraw(token, address) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.post(
        BASE_URL + "/invite/withdraw",
        {
          address: address.address
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code != 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async verifyInvite(hash){
    try {
      let response = await axios.get(
        `${BASE_URL}/invite/verify/${hash}`,
        API_HEADER
      );
      
      return response.data;
    }catch(error){
      return internalServerError();
    }
  }
}

export default InviteService;
