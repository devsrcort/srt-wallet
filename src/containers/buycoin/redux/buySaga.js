import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../errors/statusCodeMessage";

// SERVICES
import BuyService from "../../../services/buyService";
import CoinService from "../../../services/coinService";
import TransactionService from "../../../services/transactionService";

// UTILS
import { getAuthToken } from "../../../utils/localStorage";
import { convertBiggestCoinUnit } from "../../../utils/numbers";
import { getUserSeedWords } from "../../../utils/localStorage";
import { decryptAes } from "../../../utils/cryptography";

const buyService = new BuyService();
const coinService = new CoinService();
const transactionService = new TransactionService();

export function* setClearBuySaga() {
  yield put({
    type: "SET_CLEAR_BUY_REDUCER"
  });
}

export function* setModalStepSaga(payload) {
  yield put({
    type: "SET_MODAL_BUY_STEP_REDUCER",
    step: payload.step
  });
}

export function* openModalPaySaga(payload) {
  yield put({
    type: "SET_MODAL_OPEN_REDUCER",
    open: payload.open
  });
}

export function* getBuyCoinsEnabledSaga() {
  try {
    yield put({
      type: "SET_LOADING_COIN_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(buyService.getCoins, token);

    if (!response.data.services) {
      yield put({
        type: "SET_LOADING_COIN_REDUCER",
        payload: false
      });
      yield put(internalServerError());
    }

    const services = response.data.services;

    const coins = services.reduce((availableCoins, coin) => {
      if (coin.status === "active") {
        const active = {
          title: coin.abbreviation.toUpperCase(),
          value: {
            id: coin.id,
            abbreviation: coin.abbreviation,
            address: coin.address,
            fee: coin.fee
          },
          img: `/images/icons/coins/${coin.abbreviation}.png`
        };

        availableCoins.push(active);
      }

      return availableCoins;
    }, []);

    yield put({
      type: "GET_COINS_REDUCER",
      coins: coins
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getCoinForPaymentSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_PACK_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(buyService.getCoinPayment, token, payload.coin);

    if (!response.coins) {
      yield put({
        type: "SET_LOADING_PACK_REDUCER",
        payload: false
      });
      yield put(internalServerError());
      return;
    }

    let coins = [];

    if (response.coins.length > 0) {
      response.coins.map(val => {
        if (val.abbreviation !== payload.coin) {
          coins.push(val);
        }
      });
    }

    yield put({
      type: "GET_COIN_FOR_PAYMENT_REDUCER",
      coins: coins || [] //response.coins || [],
    });

    return;
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getCoinPackageSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_PACK_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(buyService.getPackages, token, payload.coin);

    if (!response.packages) {
      yield put({
        type: "SET_LOADING_PACK_REDUCER",
        payload: false
      });
      yield put(internalServerError());
    }

    yield put({
      type: "GET_BUY_PACKAGE_REDUCER",
      packages: response.packages || [],
      id: payload.id,
      coin: payload.coin,
      address: payload.address
    });

    return;
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setBuyPackageSaga(payload) {
  yield put({
    type: "SET_BUY_PACKAGE_REDUCER",
    package: payload.package,
    amount: payload.amount,
    amountFiat: payload.amountFiat
  });
}

export function* setCoinSelectedSaga(payload) {
  yield put({
    type: "SET_BUY_COIN_PAYMENT_REDUCER",
    coin: payload.coin,
    address: payload.address,
    id: payload.id
  });
}

export function* getFeeBuySaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    let response = yield call(
      coinService.getFee,
      payload.coin,
      payload.fromAddress,
      payload.toAddress,
      payload.amount,
      payload.decimalPoint
    );

    if (!response.fee) {
      yield put({
        type: "SET_LOADING_REDUCER",
        payload: false
      });
      yield put(internalServerError());
    }

    yield put({
      type: "GET_FEE_BUY_REDUCER",
      fee: response
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setFeeBuySaga(payload) {
  yield put({
    type: "SET_FEE_BUY_REDUCER",
    fee: payload
  });
}

export function* setAmountPaySaga(payload) {
  yield put({
    type: "SET_AMOUNT_BUY_PAY_REDUCER",
    amount: payload
  });
}

export function* setBuySaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    const abbreviation = payload.payload.coin;
    const token = yield call(getAuthToken);

    const balanceResponse = yield call(
      coinService.getCoinBalance,
      abbreviation,
      payload.payload.address,
      token
    );

    const balance = balanceResponse.data.data.available;
    const amount = payload.payload.amount;

    const data = {
      balance: convertBiggestCoinUnit(balance, payload.payload.decimalPoint),
      amount: convertBiggestCoinUnit(amount, payload.payload.decimalPoint),
      receiveAddress: payload.payload.receiveAddress
    };

    yield put({
      type: "SET_AMOUNT_BUY_PAY_REDUCER",
      payload: data
    });
  } catch (error) {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: false
    });
    yield put(internalServerError());
  }
}

export function* confirmBuySaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    const coin = payload.buy.coin;

    const payloadTransaction = {
      coin: coin,
      fromAddress: payload.buy.fromAddress,
      toAddress: payload.buy.toAddress,
      lunesUserAddress: payload.buy.lunesUserAddress,
      amount: payload.buy.amount,
      amountReceive: payload.buy.amountReceive,
      fee: payload.buy.fee,
      feePerByte: payload.buy.feePerByte,
      feeLunes: payload.buy.feeLunes,
      price: payload.buy.price,
      decimalPoint: payload.buy.decimalPoint
    };

    try {
      let seed = yield call(getUserSeedWords);
      let token = yield call(getAuthToken);

      // pega o servico disponivel
      let lunesWallet = yield call(
        transactionService.buyService,
        payloadTransaction.coin,
        token
      );

      if (lunesWallet) {
        let response = yield call(
          transactionService.transaction,
          lunesWallet.id,
          payloadTransaction,
          lunesWallet,
          decryptAes(seed, payload.buy.user),
          token
        );

        const transacao_obj = JSON.parse(response.config.data);

        if (response) {
          const payload_elastic = {
            txID: transacao_obj.txID,
            packageId: payload.buy.buypack.idpack,
            coinId: payload.buy.buypack.paycoinid, //payload.buy.buypack.coin.id,
            address: payload.buy.buypack.receiveAddress, //payloadTransaction.fromAddress,
            amount: payloadTransaction.amountReceive,
            coin: payload.buy.buypack.coin.abbreviation //coin
          };

          let response_elastic = yield call(
            buyService.sendBuy,
            token,
            payload_elastic
          );

          yield put({
            type: "SET_LOADING_REDUCER", //SET_CLEAR_BUY_REDUCER
            payload: false
          });

          if (response_elastic.data.errorMessage) {
            yield put({
              type: "SET_MODAL_BUY_STEP_REDUCER",
              step: 4
            });
            yield put(internalServerError());
          } else {
            yield put({
              type: "SET_MODAL_BUY_STEP_REDUCER",
              step: 3
            });
          }

          return;
        }
      }

      yield put({
        type: "SET_CLEAR_BUY_REDUCER"
      });

      yield put({
        type: "SET_MODAL_BUY_STEP_REDUCER",
        step: 4
      });

      yield put(internalServerError());
      return;
    } catch (error) {
      yield put({
        type: "SET_LOADING_REDUCER",
        payload: false
      });

      yield put({
        type: "SET_MODAL_BUY_STEP_REDUCER",
        step: 4
      });

      yield put(internalServerError());
    }
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getHistoryBuySaga(payload) {
  try {
    let { coins } = payload;

    yield put({
      type: "SET_LOADING_HISTORY",
      payload: true
    });

    let token = yield call(getAuthToken);
    let history = yield call(buyService.getHistory, token, coins);

    yield put({
      type: "GET_HISTORY_BUY_REDUCER",
      history
    });
    yield put({ type: "SET_LOADING_HISTORY", payload: false });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getLunesBuyPrices(payload) {
  try {
    let { coins } = payload;
    let token = yield call(getAuthToken);
    let response = yield call(buyService.getLunesBuyPrices, token);

    coins.lunes.price.BRL.price = response.BRL.price;
    coins.lunes.price.EUR.price = response.EUR.price;
    coins.lunes.price.USD.price = response.USD.price;
   
    yield put({
      type: "GET_LUNES_BUY_PRICES",
      coins
    });

    return;
  } catch (error) {
    yield put(internalServerError());
  }
}
