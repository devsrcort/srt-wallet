import { put, call } from "redux-saga/effects";
import {
  internalServerError,
  modalSuccess
} from "../../errors/statusCodeMessage";

// UTILS
import { getAuthToken, getDecodedAuthToken } from "../../../utils/localStorage";
import i18n from "../../../utils/i18n";
import { decodeToken } from "../../../utils/cryptography";
import { getChatBundle } from "../chat/functions";

// SERVICES
import P2pService from "../../../services/p2pService";

const p2pService = new P2pService();

//prepare to the seller, open to the buyer
export function* prepareOrOpenChat(payload) {
  try {
    let { order } = payload;

    let state = window.store.getState();
    let { orders: myOrders } = state.p2p;

    if (!myOrders) {
      yield put({
        type: "REQUEST_FAILED",
        message: i18n.t("P2P_NO_USER_ORDERS")
      });
      return;
    }

    order = myOrders.find(item => (item.id === order.id ? true : false));

    if (!order) {
      yield put({
        type: "REQUEST_FAILED",
        message: i18n.t("P2P_FAILED_TO_FIND_ORDER")
      });

      return;
    }

    let seller = order.sell.user;
    seller.id = parseInt(seller.id);

    let decodedToken = getDecodedAuthToken();
    let myId = decodedToken.payload.id | 0;
    let typeOfUser; //eslint-disable-line

    typeOfUser = myId === seller.id ? "seller" : "buyer";

    if (typeOfUser === "seller") {
      yield put({
        type: "CHAT_DETAILS_SETTER",
        payload: {
          myId,
          currentOrder: order,
          open: true, //"chat" opens to the seller, but the bundle wont
          seller,
          typeOfUser
          //buyer is going to be defined when the seller select who he's going to chat
        }
      });

      return;
    }

    //chat opens to the buyer
    let buyer = { id: myId };
    yield put({
      type: "CHAT_DETAILS_SETTER",
      payload: {
        myId,
        currentOrder: order,
        open: true,
        seller,
        buyer,
        typeOfUser,
        currentRoom: undefined
      }
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: "REQUEST_FAILED",
      message: i18n.t("P2P_CHAT_FAILED_TO_OPEN_CHAT")
    });
  }
}

const CHANGE_SKELETON_ERROR_STATE = {
  type: "CHANGE_SKELETON_ERROR_STATE",
  state: true
};

export function* openChat(payload) {
  yield put({
    type: "OPEN_CHAT_P2P_REDUCER",
    iduser: payload.iduser
  });
}

export function* openChatToTheSeller(payload) {
  let { buyer } = payload;
  if (!buyer) throw new Error("Failed to open chat");
  let { seller, currentOrder } = window.store.getState().p2p.chatDetails;
  let { id: adId } = currentOrder;
  let { id: adOwnerId } = seller;
  let { id: buyerId } = buyer || {};
  yield put({
    type: "CHAT_DETAILS_SETTER",
    payload: {
      open: true,
      buyer
    }
  });
  getChatBundle({ adOwnerId, adId, buyerId });
}
export function* closeChat() {
  yield put({
    type: "CHAT_DETAILS_SETTER",
    payload: {
      currentOrder: undefined,
      open: false,
      seller: undefined,
      buyer: undefined,
      typeOfUser: undefined,
      currentRoom: undefined
    }
  });
}

export function* setModalStepSaga(payload) {
  yield put({
    type: "SET_MODAL_FLOW_STEP_REDUCER",
    step: payload.step
  });
}

export function* openModalPaySaga(payload) {
  yield put({
    type: "SET_MODAL_OPEN_REDUCER",
    open: payload.open
  });
}

export function* getP2PMyOrdersSaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });

    let token = yield call(getAuthToken);
    let response = yield call(p2pService.getMyOrders, token, payload.coin);

    if (response.errorMessage) {
      yield put({
        type: "GET_MY_ORDERS_REDUCER",
        orders: []
      });
    } else {
      yield put({
        type: "GET_MY_ORDERS_REDUCER",
        orders: response.data.orders
      });
    }
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);
    yield put(internalServerError());
  }
}

export function* getPaymentMethodsWhenBuying(payload) {
  try {
    let { coin } = payload;
    yield put({ type: "BUY_SETTER", data: { paymentMethodLoading: true } });

    let token = yield call(getAuthToken);
    let response = yield call(
      p2pService.getPaymentMethodsWhenBuying,
      token,
      coin
    );

    let cripto = [];
    if (response.cripto) {
      response.cripto.forEach(val => {
        if (val.status == "active") {
          cripto.push({
            id: val.id,
            title: val.name.toUpperCase(),
            img: `images/icons/coins/${val.abbreviation}.png`,
            value: val.abbreviation
          });
        }
      });
    }

    if (response.fiat) {
      response.fiat.forEach(val => {
        if (val.status == "active") {
          cripto.push({
            id: val.id,
            title: val.name.toUpperCase(),
            img: `images/icons/fiat/${val.abbreviation}.png`,
            value: val.abbreviation
          });
        }
      });
    }

    yield put({ type: "BUY_SETTER", data: cripto });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getP2PHistorySaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });

    let token = yield call(getAuthToken);
    let response = yield call(
      p2pService.getHistory,
      token,
      payload.coin,
      payload.historyType
    );

    if (response.errorMessage) {
      yield put({
        type: "REQUEST_FAILED",
        message: i18n.t("P2P_FAILED_TO_GET_ORDERS")
      });
      yield put({
        type: "GET_HISTORY_REDUCER",
        orders: []
      });
    } else {
      yield put({
        type: "GET_HISTORY_REDUCER",
        orders: response.data.orders
      });
    }
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);
    yield put(internalServerError());
  }
}

export function* acceptOfferWhenBuying(payload) {
  try {
    yield put({ type: "BUY_SETTER", data: { isBuyLoading: true } });
    let token = yield call(getAuthToken);

    yield call(p2pService.acceptOfferWhenBuying, token, payload.data);

    yield put({ type: "SUCCESS_REQUEST", message: "" });
    yield put({ type: "BUY_SETTER", data: { isBuyLoading: false } });
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);
    yield put(internalServerError());
  }
}

export function* getP2PFilterSaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });

    const { typeOrder, coinBuy } = payload;

    let token = yield call(getAuthToken);
    let response = yield call(p2pService.getFilter, token, typeOrder, coinBuy);
    yield put({
      type: "GET_FILTER_REDUCER",
      orders: !response ? [] : response.orders
    });
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);
    yield put(internalServerError());
  }
}

export function* createOfferWhenSelling(payload) {
  try {
    yield put({ type: "SET_LOADING_CREATE_OFFER", loading: true });

    let token = yield call(getAuthToken);
    let response = yield call(
      p2pService.createOfferWhenSelling,
      token,
      payload.data
    );

    if (response.data.data.orderId) {
      yield put({
        type: "CREATE_OFFER_DONE",
        offer: response.data.data.orderId
      });
    } else {
      yield put({
        type: "CREATE_OFFER_ERROR"
      });
    }
  } catch (error) {
    yield put({
      type: "CREATE_OFFER_ERROR"
    });
    yield put(internalServerError());
  }
}

export function* setP2POrdersCancelSaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });

    let token = yield call(getAuthToken);

    let response = yield call(
      p2pService.setCancelOrder,
      token,
      payload.orderId
    );

    yield put({
      type: "SET_P2P_CANCEL_ORDERS_REDUCER",
      orderId: response
    });
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);

    yield put(internalServerError());
  }
}

export function* createSignatureSaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });
    let token = yield call(getAuthToken);

    const response = yield call(
      p2pService.createSignature,
      token,
      payload.data
    );
    if (!response) {
      yield put(internalServerError());
    } else {
      yield put(modalSuccess(i18n.t("P2P_MODAL_SEND_INFO_SUCCESS")));
    }
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* openDeposit(payload) {
  yield put({
    type: "OPEN_DEPOSIT_P2P_REDUCER",
    order: payload.order
  });

  yield put({
    type: "CHAT_DETAILS_SETTER",
    payload: { currentOrder: payload.order }
  });
}

export function* closeDeposit() {
  yield put({
    type: "CLOSE_DEPOSIT_P2P_REDUCER"
  });
}

export function* setUserId() {
  let token = decodeToken(getAuthToken());
  let id = token.payload.id;
  yield put({ type: "SET_USER_ID", id });
}

export function* openAvaliation(payload) {
  yield put({
    type: "OPEN_AVALIATION_P2P_REDUCER",
    order: payload.order
  });
}

export function* closeAvaliation() {
  yield put({
    type: "CLOSE_AVALIATION_P2P_REDUCER"
  });
}

export function* setTabIconSaga(payload) {
  yield put({
    type: "SET_TAB_ICON_REDUCER",
    tabIcon: payload.tabIcon
  });
}

export function* getProfileSaga(payload) {
  try {
    yield put({ type: "SET_LOADING_P2P", loading: true });

    const token = yield call(getAuthToken);
    const response = yield call(p2pService.getProfile, token, payload.profile);
    yield put({
      type: "GET_PROFILE_REDUCER",
      profile: response.data
    });
  } catch (error) {
    yield put(CHANGE_SKELETON_ERROR_STATE);
    yield put(internalServerError());
  }
}
export function* setP2PRatingOrderSaga(payload) {
  try {
    let token = yield call(getAuthToken);

    yield call(p2pService.setRatingOrder, token, payload.data);
  } catch (error) {
    yield put(internalServerError());
  }
}
export function* confirmOrder(payload) {
  try {
    let token = yield call(getAuthToken);

    yield call(p2pService.confirmOrder, token, payload.idOrder);
  } catch (error) {
    yield put(internalServerError());
  }
}
export function* setUserDescription(action) {
  try {
    let token = yield call(getAuthToken);

    const response = yield call(p2pService.updateUserDescription, token, {
      description: action.profile.description
    });
    if (response.status !== 200) {
      yield put(internalServerError());
    }
  } catch (error) {
    yield put(internalServerError());
  }
}
