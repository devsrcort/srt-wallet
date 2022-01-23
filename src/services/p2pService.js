import axios from "axios";

// CONSTANTS
import { BASE_URL, API_HEADER, HEADER_RESPONSE } from "../constants/apiBaseUrl";

// ERROS
import { internalServerError } from "../containers/errors/statusCodeMessage";

// UTILS
import { setAuthToken } from "../utils/localStorage";
import i18n from "../utils/i18n";

class P2pService {
  async getMyOrders(token, coin) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        BASE_URL + "/coin/" + coin + "/p2p/myorder",
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async getPaymentMethodsWhenBuying(token, coin) {
    try {
      API_HEADER.headers.Authorization = token;

      let response = await axios.get(
        `${BASE_URL}/coin/${coin}/p2p/paymentMethods`,
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);

      // if (response.status !== 200) {
      //   throw new Error(i18n.t("P2P_FAILED_GET_PAYMENT_METHOD"));
      // }

      return response.data.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async getHistory(token, coin, type) {
    try {
      API_HEADER.headers.Authorization = token;

      let response;
      if (!type || type === "p2p") {
        response = await axios.get(
          BASE_URL + "/coin/" + coin + "/p2p/history",
          API_HEADER
        );
      } else if (type === "escrow") {
        response = await axios.get(
          `${BASE_URL}/coin/${coin}/p2p/order/${type}`,
          API_HEADER
        );
      }

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async acceptOfferWhenBuying(token, data) {
    try {
      let { coin, orderId, addressBuyer } = data;
      API_HEADER.headers.Authorization = token;

      const response = await axios.post(
        `${BASE_URL}/coin/${coin}/p2p/buy`,
        {
          orderId,
          addressBuyer
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        throw new Error(i18n.t("P2P_FAILED_TO_BUY_COIN"));
      }
    } catch (error) {
      return internalServerError();
    }
  }

  async createOfferWhenSelling(token, data) {
    try {
      let {
        coin,
        type,
        paymentMethodId,
        amount,
        amountPayment,
        addressSeller,
        description
      } = data;
      API_HEADER.headers.Authorization = token;

      const response = await axios.post(
        `${BASE_URL}/coin/${coin}/p2p/order`,
        {
          type,
          paymentMethodId,
          amount,
          amountPayment,
          addressSeller,
          description
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        throw new Error(i18n.t("P2P_FAILED_TO_BUY_COIN"));
      }

      return response;
    } catch (error) {
      return internalServerError();
    }
  }

  async getFilter(token, type, coinBuy) {
    try {
      API_HEADER.headers.Authorization = token;

      const coin = !coinBuy ? "lunes" : coinBuy;
      const response = await axios.get(
        `${BASE_URL}/coin/${coin}/p2p/order/${type}/${coin}`,
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (!response.data.data) return;

      return response.data.data;
    } catch (error) {
      return internalServerError();
    }
  }

  async setCancelOrder(token, orderId) {
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/coin/lunes/p2p/order/cancel/${orderId}`,
        {},
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return false;
      }

      return response;
    } catch (error) {
      return internalServerError();
    }
  }

  async createSignature(token, data) {
    try {
      let { planId, txID } = data;
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/signature`,
        {
          planId,
          txID
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return internalServerError();
    }
  }

  async getProfile(token, userId) {
    try {
      let evaluation = undefined;
      const request = userId
        ? `${BASE_URL}/coin/lunes/p2p/profile?userId=${userId}`
        : `${BASE_URL}/coin/lunes/p2p/profile`;

      API_HEADER.headers.Authorization = token;
      let response = await axios.get(request, API_HEADER);

      if (userId) {
        evaluation = await axios.get(
          `${BASE_URL}/coin/lunes/p2p/profile/rating?userId=${userId}`,
          API_HEADER
        );
      } else {
        evaluation = await axios.get(
          `${BASE_URL}/coin/lunes/p2p/profile/rating`,
          API_HEADER
        );
      }

      response.data.data.evaluation = evaluation.data.data.rating;
      setAuthToken(response.headers[HEADER_RESPONSE]);

      return response.data;
    } catch (error) {
      return internalServerError();
    }
  }
  async setRatingOrder(token, data) {
    try {
      let { value, description, orderId } = data;
      API_HEADER.headers.Authorization = token;
      const response = await axios.post(
        `${BASE_URL}/coin/lunes/p2p/rating/${orderId}`,
        {
          value,
          description
        },
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);
      if (response.data.code !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return internalServerError();
    }
  }

  async confirmOrder(token, idOrder) {
    try {
      API_HEADER.headers.Authorization = token;

      const response = await axios.post(
        `${BASE_URL}/coin/lunes/p2p/confirm/${idOrder}`,
        {},
        API_HEADER
      );

      setAuthToken(response.headers[HEADER_RESPONSE]);

      if (response.data.code !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return internalServerError();
    }
  }

  async updateUserDescription(token, userDescription) {
    try {
      API_HEADER.headers.Authorization = token;
      const response = await axios.patch(
        `${BASE_URL}/coin/lunes/p2p/profile`,
        userDescription,
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE])
      return response;
    } catch (error) {
      return internalServerError();
    }
  }
}

export default P2pService;
