import axios from "axios";

// CONTANTS
import {
  BASE_URL,
  API_HEADER,
  TESTNET,
  HEADER_RESPONSE,
  HEADER_REQUEST_FORM,
  TETHER_URL
} from "../constants/apiBaseUrl";
import { networks } from "../constants/network";

// ERROR
import {
  internalServerError,
  modalError
} from "../containers/errors/statusCodeMessage";

// COINS
import { BtcServices, LunesServices, EthServices } from "./coins";
import CoinService from "./coinService";

// UTILS
import i18n from "../utils/i18n";
import { setAuthToken } from "../utils/localStorage";
import { convertSmallerCoinUnit } from "../utils/numbers";

class TransactionService {
  async utxo(address, coin, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.post(
        BASE_URL + "/coin/" + coin + "/transaction/utxo",
        {
          fromAddress: address
        },
        API_HEADER
      );
      const utxos = [];

      setAuthToken(response.headers[HEADER_RESPONSE]);

      response.data.data.utxos.forEach(utxo => {
        utxos.push({
          txId: utxo.txId,
          vout: utxo.vout,
          value: utxo.value
        });
      });

      return utxos;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async broadcast(txhex, coin, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.post(
        BASE_URL + "/coin/" + coin + "/transaction/broadcast",
        {
          txHex: txhex
        },
        API_HEADER
      );
      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async pushTx(raw) {
    try {
      let params = new URLSearchParams();
      params.append("signedTransaction", raw);
      let response = await axios.post(
        TETHER_URL + "/v1/transaction/pushtx/",
        params,
        HEADER_REQUEST_FORM
      );

      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async getUnsigned(params) {
    try {
      let response = await axios.post(
        TETHER_URL + "/v1/transaction/getunsigned/0",
        params,
        HEADER_REQUEST_FORM
      );
      return response.data;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async transaction(serviceId, transaction, lunesWallet, seed, token) {
    try {
      let network = undefined;
      let coinService = new CoinService();
      let {
        fromAddress,
        toAddress,
        fee,
        feePerByte,
        feeLunes,
        describe,
        price,
        amount,
        coin,
        decimalPoint,
        lunesUserAddress
      } = transaction;
      if (
        !lunesUserAddress ||
        !lunesWallet ||
        !fromAddress ||
        !toAddress ||
        !seed ||
        !fee ||
        !price ||
        !amount ||
        !serviceId ||
        !token ||
        !coin ||
        !decimalPoint
      ) {
        modalError(i18n.t("MESSAGE_TRANSACTION_FAILED"));
        return;
      }
      if (coin === "btc")
        network = TESTNET ? networks.BTCTESTNET : networks.BTC;

      if (coin === "ltc")
        network = TESTNET ? networks.LTCTESTNET : networks.LTC;

      if (coin === "bch")
        network = TESTNET ? networks.BCHTESTNET : networks.BCH;

      if (coin === "lunes")
        network = TESTNET ? networks.LUNESTESTNET : networks.LUNES;

      if (coin === "dash") network = TESTNET ? undefined : networks.DASH;

      if (coin === "eth") network = TESTNET ? networks.ROPSTEN : networks.ETH;

      if (coin === "usdt")
        network = TESTNET ? networks.BTCTESTNET : networks.BTC;

      if (coin === "nmc")
        network = TESTNET ? networks.NMCTESTNET : networks.NMC;

      if (coin === "mona")
        network = TESTNET ? networks.MONATESTNET : networks.MONA;

      if (
        coin === "btc" ||
        coin === "ltc" ||
        coin === "bch" ||
        coin === "dash" ||
        coin === "usdt" ||
        coin === "nmc" ||
        coin === "mona" 
      ) {
        let transactionBtc = new BtcServices();
        let responseBtc = await transactionBtc.createTransaction({
          fromAddress: fromAddress,
          toAddress: toAddress,
          seed: seed,
          lunesWallet: lunesWallet,
          fee:
            coin === "usdt" ? fee : convertSmallerCoinUnit(fee, decimalPoint),
          feePerByte: feePerByte,
          feeLunes: feeLunes,
          amount:
            coin === "usdt"
              ? amount
              : convertSmallerCoinUnit(amount, decimalPoint),
          coin: coin,
          token: token,
          network: network
        });

        if (responseBtc === "error" || !responseBtc) {
          return;
        }

        let responseSaveBtc = await coinService.saveTransaction(
          serviceId,
          feeLunes,
          {
            id: responseBtc,
            sender: fromAddress,
            recipient: toAddress,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            fee: convertSmallerCoinUnit(fee, decimalPoint)
          },
          coin,
          transaction.price,
          lunesUserAddress,
          describe ? describe : "P2P",
          token
        );
        return responseSaveBtc;
      } else if (coin === "eth") {
        let transactionEth = new EthServices();
        let responseEth = await transactionEth.createTransaction({
          fromAddress: fromAddress,
          toAddress: toAddress,
          seed: seed,
          lunesWallet: lunesWallet,
          fee: convertSmallerCoinUnit(fee, decimalPoint),
          feePerByte: feePerByte,
          feeLunes: feeLunes,
          amount: convertSmallerCoinUnit(amount, decimalPoint),
          coin: coin,
          token: token,
          network: network
        });

        if (responseEth === "error" || !responseEth) {
          return;
        }

        let responseSaveEth = await coinService.saveTransaction(
          serviceId,
          feeLunes,
          {
            id: responseEth,
            sender: fromAddress,
            recipient: toAddress,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            fee: convertSmallerCoinUnit(fee, decimalPoint)
          },
          coin,
          transaction.price,
          lunesUserAddress,
          describe ? describe : "P2P",
          token
        );
        return responseSaveEth;
      } else if (coin === "lunes") {
        let transactionLunes = new LunesServices();
        let respondeLunes = await transactionLunes.createLunesTransaction({
          network: network,
          seed: seed,
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: convertSmallerCoinUnit(amount, decimalPoint),
          fee: convertSmallerCoinUnit(fee, decimalPoint)
        });

        if (respondeLunes === "error" || !respondeLunes) {
          return;
        }

        let responseSaveLunes = await coinService.saveTransaction(
          serviceId,
          feeLunes,
          respondeLunes,
          coin,
          transaction.price,
          lunesUserAddress,
          describe ? describe : "P2P",
          token
        );
        return responseSaveLunes;
      }

      return;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async createLeasing(amount, fee, address, seed, token) {
    let lunes = new LunesServices();
    let coinService = new CoinService();

    let response = await lunes.createLeasing({
      amount: amount,
      fee: fee,
      recipient: address,
      seed: seed,
      network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
    });

    await coinService.saveTransaction(
      4,
      0,
      {
        id: response.id,
        sender: response.sender,
        recipient: response.recipient,
        amount: response.amount,
        fee: response.fee
      },
      "lunes",
      undefined,
      undefined,
      "Create Leasing",
      token
    );

    return response;
  }

  async cancelLeasing(txId, fee, seed, token) {
    try {
      let lunes = new LunesServices();
      let coinService = new CoinService();

      let response = await lunes.cancelLeasing({
        fee: convertSmallerCoinUnit(fee, 8),
        transactionId: txId,
        seed: seed,
        network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
      });

      await coinService.saveTransaction(
        4,
        0,
        {
          id: txId,
          sender: response.sender,
          recipient: response.recipient,
          amount: response.amount,
          fee: response.fee
        },
        "lunes",
        undefined,
        undefined,
        "Cancel Leasing",
        token
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async transactionService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(
        BASE_URL + "/service/transferencia",
        API_HEADER
      );

      let lunesCoin = await response.data.data.services.map(value => {
        coins[value.abbreviation] = value;
      });

      /* eslint-disable */
      await Promise.all(lunesCoin);
      /* eslint-enabled */

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return coin ? coins[coin] : coins;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async rechargeService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(BASE_URL + "/service/recarga", API_HEADER);

      let lunesCoin = await response.data.data.services.map(value => {
        coins[value.abbreviation] = value;
      });

      /* eslint-disable */
      await Promise.all(lunesCoin);
      /* eslint-enabled */

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return coin ? coins[coin] : coins;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async invoiceService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(
        BASE_URL + "/service/pagamento",
        API_HEADER
      );

      let lunesCoin = await response.data.data.services.map(value => {
        coins[value.abbreviation] = value;
      });

      /* eslint-disable */
      await Promise.all(lunesCoin);
      /* eslint-enabled */

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return coin ? coins[coin] : coins;
    } catch (error) {
      console.warn(error);
      internalServerError();
      return error;
    }
  }

  async aliasService(token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.get(BASE_URL + "/service/alias", API_HEADER);

      setAuthToken(response.headers[HEADER_RESPONSE]);
      return response.data.data.services[0];
    } catch (error) {
      console.warn(error);
      internalServerError();
      return error;
    }
  }

  async buyService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(BASE_URL + "/service/compra", API_HEADER);

      let lunesCoin = await response.data.data.services.map(value => {
        coins[value.abbreviation] = value;
      });

      /* eslint-disable */
      await Promise.all(lunesCoin);
      /* eslint-enabled */

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return coin ? coins[coin] : coins;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async p2pService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(BASE_URL + "/service/assinatura", API_HEADER);

      let lunesCoin = await response.data.data.services.map(value => {
        coins[value.abbreviation] = value;
      });

      /* eslint-disable */
      await Promise.all(lunesCoin);
      /* eslint-enabled */

      setAuthToken(response.headers[HEADER_RESPONSE]);

      return coin ? coins[coin] : coins;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async createAlias(alias, seed) {
    try {
      let transaction = new LunesServices();
      let response = await transaction.createAlias({
        alias,
        seed,
        network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
      });

      return response;
    } catch (error) {
      console.warn(error);
      return error;
    }
  }

  async getAliases(address) {
    try {
      let transaction = new LunesServices();
      let response = await transaction.getAliases({
        address,
        network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
      });

      return response;
    } catch (error) {
      return error;
    }
  }

  async getAddressByAlias(alias) {
    try {
      let transaction = new LunesServices();
      let response = await transaction.getAddressByAlias({
        alias,
        network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
      });

      return response;
    } catch (error) {
      return error;
    }
  }
}
export default TransactionService;
