import axios from "axios";

// CONSTANTS
import { BASE_URL, API_HEADER, HEADER_RESPONSE } from "../constants/apiBaseUrl";

// ERROS
import { internalServerError } from "../containers/errors/statusCodeMessage";

// UTILS
import { setAuthToken } from "../utils/localStorage";

class BuyService {
  async getPackages(token, coin) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        BASE_URL + "/coin/" + coin + "/sell/package",
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      let packages = [];
      response.data.data.packages.map(val => {
        packages.push(val);
      });

      return {
        packages
      };
    } catch (error) {
      return internalServerError();
    }
  }

  async getCoinPayment(token, coin) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        BASE_URL + "/coin/" + coin + "/sell/paymentMethods",
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);

      // if (response.code !== 200) {
      //   return internalServerError();
      // }

      let coins = [];
      response.data.data.coin.map(val => {
        coins.push(val);
      });

      return {
        coins
      };
    } catch (error) {
      return internalServerError();
    }
  }

  async getCoins(token) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(BASE_URL + "/service/compra", API_HEADER);

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async sendBuy(token, payload) {
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/coin/${payload.coin}/sell`,
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

  async getHistory(token, coins) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        `${BASE_URL}/coin/${coins}/sell/history`,
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return internalServerError();
      }

      return response.data.data.txs;
    } catch (err) {
      return internalServerError();
    }
  }

  async getLunesBuyPrices(token) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        `${BASE_URL}/coin/lunes/price?service=compra`,
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data.data;
    } catch (err) {
      return internalServerError();
    }
  }
}

export default BuyService;
