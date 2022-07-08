import axios from "axios";

// CONTANTS
import {
    BASE_URL,
    API_HEADER,
    TESTNET,
    HEADER_RESPONSE,
    HEADER_REQUEST_FORM,
    TETHER_URL,
} from "../constants/apiBaseUrl";

// ERROR
import {
    internalServerError,
    modalError,
} from "../containers/errors/statusCodeMessage";

// COINS
import CoinService from "./coinService";
import { SRTServices } from "./coins";

// UTILS
import i18n from "../utils/i18n";
import { setAuthToken } from "../utils/localStorage";
import { convertSmallerCoinUnit } from "../utils/numbers";

class TransactionService {
    async utxo(address, coin, token) {
        try {
            API_HEADER.headers.Authorization = token;
            let response = await axios.post(
                BASE_URL + "/coin/" + coin + "/transaction/utxo", {
                    fromAddress: address,
                },
                API_HEADER
            );
            const utxos = [];

            setAuthToken(response.headers[HEADER_RESPONSE]);

            response.data.data.utxos.forEach((utxo) => {
                utxos.push({
                    txId: utxo.txId,
                    vout: utxo.vout,
                    value: utxo.value,
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
                BASE_URL + "/coin/" + coin + "/transaction/broadcast", {
                    txHex: txhex,
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

    async transaction(transaction, token) {
        try {
            let {
                fromAddress,
                toAddress,
                fee,
                amount,
            } = transaction;

            let coinService = new CoinService();
            let response = await coinService.createTransaction(
                fromAddress,
                toAddress,
                amount,
                fee,
                token
            );

            if (response === "error" || !response) {
                return;
            }

            return response;
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

            let lunesCoin = await response.data.data.services.map((value) => {
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

            let lunesCoin = await response.data.data.services.map((value) => {
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

            let lunesCoin = await response.data.data.services.map((value) => {
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
            let response = await axios.get(
                BASE_URL + "/service/assinatura",
                API_HEADER
            );

            let lunesCoin = await response.data.data.services.map((value) => {
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
}
export default TransactionService;