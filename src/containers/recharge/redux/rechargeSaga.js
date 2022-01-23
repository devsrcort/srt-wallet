import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../errors/statusCodeMessage";

// SERVICES
import RechargeService from "../../../services/rechargeService";
import CoinService from "../../../services/coinService";
import { convertBiggestCoinUnit } from "../../../utils/numbers";
import TransactionService from "../../../services/transactionService";

// UTILS
import { getUserSeedWords } from "../../../utils/localStorage";
import { decryptAes } from "../../../utils/cryptography";
import { getAuthToken } from "../../../utils/localStorage";

const rechargeService = new RechargeService();
const coinService = new CoinService();
const transactionService = new TransactionService();

export function* setModalStepSaga(payload) {
  yield put({
    type: "SET_MODAL_RECHARGE_STEP_REDUCER",
    step: payload.step
  });
}

export function* getRechargeCoinsEnabledSaga() {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(rechargeService.getCoins, token);

    const services = response.data.services;

    const coins = services.reduce((availableCoins, coin) => {
      if (coin.status === "active") {
        const active = {
          title: coin.abbreviation.toUpperCase(),
          value: {
            id: coin.id,
            abbreviation: coin.abbreviation,
            address: coin.address
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

export function* getOperatorsSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_VAL_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(
      rechargeService.getOperadoras,
      token,
      payload.ddd
    );

    if (!response.operators) {
      yield put({
        type: "SET_LOADING_VAL_REDUCER",
        payload: false
      });
      yield put(internalServerError());
    }

    yield put({
      type: "GET_OPERADORAS_REDUCER",
      operadoras: response.operators || []
    });

    return;
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getValuesCreditSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_VAL_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(
      rechargeService.getValoresRecarga,
      token,
      payload
    );

    if (Array.isArray(response)) {
      yield put({
        type: "GET_VALORES_REDUCER",
        valores: response,
        valueError: false
      });
    }else{
      yield put({
        type: "GET_VALORES_REDUCER",
        valores: [],
        valueError: true
      });
    }

    return;
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setRechargeSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    const { abbreviation } = payload.recharge.coin;
    const token = yield call(getAuthToken);

    const amountResponse = yield call(
      rechargeService.getCoinAmountPay,
      token,
      abbreviation,
      parseFloat(payload.recharge.value)
    );

    const balanceResponse = yield call(
      coinService.getCoinBalance,
      abbreviation,
      payload.recharge.address,
      token
    );

    const balance = balanceResponse.data.data.available;
    const amount = amountResponse.data.data.value;
    const decimalPoint = payload.recharge.decimalPoint;

    const data = {
      number: payload.recharge.number,
      coin: payload.recharge.coin,
      balance: convertBiggestCoinUnit(balance, decimalPoint),
      amount: convertBiggestCoinUnit(amount, decimalPoint),
      value: payload.recharge.value,
      operator: {
        id: payload.recharge.operatorId,
        name: payload.recharge.operatorName
      }
    };

    yield put({
      type: "SET_RECHARGE_REDUCER",
      payload: data
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getFeeRechargeSaga(payload) {
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
      type: "GET_FEE_RECHARGE_REDUCER",
      fee: response
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setFeeRechargeSaga(payload) {
  yield put({
    type: "SET_FEE_RECHARGE_REDUCER",
    fee: payload
  });
}

export function* confirmRechargeSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    const payloadTransaction = {
      coin: payload.recharge.coin,
      fromAddress: payload.recharge.fromAddress,
      toAddress: payload.recharge.toAddress,
      lunesUserAddress: payload.recharge.lunesUserAddress,
      amount: payload.recharge.amount,
      fee: payload.recharge.fee,
      feePerByte: payload.recharge.feePerByte,
      feeLunes: payload.recharge.feeLunes,
      price: payload.recharge.price,
      decimalPoint: payload.recharge.decimalPoint
    };

    try {
      let seed = yield call(getUserSeedWords);
      let token = yield call(getAuthToken);

      // pega o servico disponivel
      let lunesWallet = yield call(
        transactionService.rechargeService,
        payloadTransaction.coin,
        token
      );

      if (lunesWallet) {
        let response = yield call(
          transactionService.transaction,
          lunesWallet.id,
          payloadTransaction,
          lunesWallet,
          decryptAes(seed, payload.recharge.user),
          token
        );

        const transacao_obj = JSON.parse(response.config.data);
        const ddd = payload.recharge.recharge.number.substring(0, 2);
        const totalnumero = payload.recharge.recharge.number.length;
        const numero = payload.recharge.recharge.number.substring(
          2,
          totalnumero
        );

        if (response) {
          const payloadElastic = {
            ddd: ddd,
            operatorId: payload.recharge.recharge.operator.id,
            operatorName: payload.recharge.recharge.operator.name,
            phone: numero,
            value: parseFloat(payload.recharge.recharge.value),
            txID: transacao_obj.txID,
            describe: "Recarga",
            serviceId: payload.recharge.recharge.coin.id
          };

          let response_elastic = yield call(
            rechargeService.sendRecharge,
            token,
            payloadElastic
          );

          yield put({
            type: "SET_CLEAR_RECHARGE_REDUCER"
          });

          if (response_elastic.data.errorMessage) {
            yield put({
              type: "SET_MODAL_RECHARGE_STEP_REDUCER",
              step: 6
            });
            yield put(internalServerError());
          } else {
            yield put({
              type: "SET_MODAL_RECHARGE_STEP_REDUCER",
              step: 5
            });
          }

          yield put({
            type: "SET_LOADING_REDUCER",
            payload: false
          });
          return;
        }
      }

      yield put({
        type: "SET_CLEAR_RECHARGE_REDUCER"
      });

      yield put({
        type: "SET_MODAL_RECHARGE_STEP_REDUCER",
        step: 5
      });

      yield put({
        type: "SET_LOADING_REDUCER",
        payload: false
      });

      yield put({
        type: "SET_MODAL_RECHARGE_STEP_REDUCER",
        step: 6
      });

      yield put(internalServerError());
      return;
    } catch (error) {
      yield put({
        type: "SET_LOADING_REDUCER",
        payload: false
      });

      yield put({
        type: "SET_MODAL_RECHARGE_STEP_REDUCER",
        step: 6
      });

      yield put(internalServerError());
    }
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getHistoryRechargeSaga() {
  try {
    yield put({
      type: "SET_LOADING_REDUCER",
      payload: true
    });

    let token = yield call(getAuthToken);
    let response = yield call(rechargeService.getHistory, token);

    let data = [];
    if (response.recharges) {
      data = response.recharges;
    }

    yield put({
      type: "GET_HISTORY_RECHARGE_REDUCER",
      history: data
    });
  } catch (error) {
    yield put(internalServerError());
  }
}
