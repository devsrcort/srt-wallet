import axios from "axios";

// CONSTANTS
import {
    BASE_URL,
    API_HEADER,
    HEADER_RESPONSE,
    TESTNET
} from "../constants/apiBaseUrl";

// ERROR
import { internalServerError } from "../containers/errors/statusCodeMessage";

// UTILS
import {
    getUsername,
    getDefaultCrypto,
    setDefaultCrypto,
    setAuthToken,
} from "../utils/localStorage";
import {
    convertBiggestCoinUnit,
    convertSmallerCoinUnit
} from "../utils/numbers";
// import i18n from "../utils/i18n.js";

class CoinService {
    async getGeneralInfo(token, seed) {
        try {
            API_HEADER.headers.Authorization = token;
            let coins = [];
            let defaultCrypto = await getDefaultCrypto();

            let availableCoins = [{
                abbreviation: "SRT",
                blockExplorerUrl: "",
                decimalPoint: 18,
                family: "SRT",
                id: 1,
                name: "SRT",
                numberConfirmations: 1,
                smallerUnit: "SRT",
                status: "active",
                price: 0
            }];

            const promises = availableCoins.map(async(coin, index) => {
                // CHECK ACTIVE DEFAULT COIN
                if (defaultCrypto === coin.abbreviation && coin.status !== "active") {
                    let coin = availableCoins[index + 1] ?
                        availableCoins[index + 1].abbreviation :
                        availableCoins[index - 1].abbreviation;
                    setDefaultCrypto(coin);
                }

                availableCoins[index].coinHistory = undefined;
                let localSeed = seed;

                if (coin.status === "active") {

                    // GET BALANCE
                    let responseBalance = await axios.get(
                        BASE_URL + "/users/getUserInfo", { params: { id: getUsername() }, headers: { "Authorization": token } }
                    );

                    if (responseBalance.data.balance) {
                        availableCoins.token = responseBalance.data.token;
                        availableCoins[index].balance = {
                            available: parseInt(responseBalance.data.balance),
                            total: parseInt(responseBalance.data.balance),
                        };

                        availableCoins[index].address = responseBalance.data.addr;
                        let responsePrice = await axios.get(
                            BASE_URL + "/users/getTokenPrice", {
                                headers: { "Authorization": token }
                            });
                        availableCoins[index].price = responsePrice.data.price;
                        availableCoins[index].totalPrice = responsePrice.data.price * parseInt(availableCoins[index].balance.available);
                    } else {
                        availableCoins[index].status = "inactive";
                        availableCoins[index].balance = undefined;
                    }
                } else {
                    availableCoins[index].address = localSeed;
                    availableCoins[index].balance = undefined;
                }
            });

            /* eslint-disable */
            await Promise.all(promises);
            /* eslint-enable */

            availableCoins.map(async(coin, index) => {
                coins[coin.abbreviation] = availableCoins[index];
            });

            coins.token = availableCoins.token;
            return coins;
        } catch (error) {
            internalServerError();
            return;
        }
    }

    async getAvailableAmount(address, token) {
        try {
            API_HEADER.headers.Authorization = token;

            let response = await axios.post(
                BASE_URL + "/users/getAvailTokenAmt", {
                    fromAddr: address
                },
                API_HEADER
            );

            setAuthToken(response.headers[HEADER_RESPONSE]);

            let amount = { amount: response.data.amount };
            return amount;
        } catch (error) {
            internalServerError();
            return;
        }
    }

    async getFee(fromAddress, token) {
        try {
            API_HEADER.headers.Authorization = token;

            let response = await axios.post(
                BASE_URL + "/users/getTransferFee", {
                    fromAddr: fromAddress,
                },
                API_HEADER
            );

            setAuthToken(response.headers[HEADER_RESPONSE]);

            let fee = {
                feeValue: response.data.fee,
            };
            return fee;
        } catch (error) {
            internalServerError();
            return;
        }
    }

    async saveTransaction(
        serviceId,
        feeLunes,
        transaction,
        coin,
        price,
        lunesUserAddress,
        describe,
        token
    ) {
        try {
            API_HEADER.headers.Authorization = token;
            let transactionData = {
                serviceId: serviceId,
                feeLunes: feeLunes,
                txID: transaction.id,
                from: transaction.sender,
                to: transaction.recipient,
                amount: transaction.amount,
                fee: transaction.fee,
                describe: describe ? describe : null,
                cashback: { address: lunesUserAddress },
                price: {
                    USD: price ? price.USD.price : undefined,
                    EUR: price ? price.EUR.price : undefined,
                    BRL: price ? price.BRL.price : undefined
                }
            };

            let response = await axios.post(
                BASE_URL +
                "/coin/" +
                coin +
                "/transaction/history/" +
                transaction.sender,
                transactionData,
                API_HEADER
            );
            setAuthToken(response.headers[HEADER_RESPONSE]);

            return response;
        } catch (error) {
            console.warn(error, error.response);
            internalServerError();
        }
    }

    async createTransaction(fromAddr, toAddr, amount, fee, token) {
        try {
            API_HEADER.headers.Authorization = token;

            let response = await axios.post(BASE_URL +
                "/users/sendTokenByClient", {
                    fromAddr: fromAddr,
                    toAddr: toAddr,
                    amount: amount,
                    fee: fee
                },
                API_HEADER
            );

            setAuthToken(response.headers[HEADER_RESPONSE]);

            return response;
        } catch (error) {
            console.warn(error, error.response);
            internalServerError();
        }
    }
}

export default CoinService;