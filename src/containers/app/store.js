import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga";
import skeleton from "../skeleton/redux/skeletonReducer";
import user from "../user/redux/userReducer";
import wallet from "../wallet/redux/walletReducer";
import leasing from "../leasing/redux/leasingReducer";
import coupons from "../coupons/redux/couponsReducer";
import settings from "../settings/redux/settingsReducer";
import error from "../errors/redux/errorReducer";
import payment from "../payment/redux/paymentReducer";
import assets from "../assets/redux/assetsReducer";
import recharge from "../recharge/redux/rechargeReducer";
import p2p from "../p2p/redux/p2pReducer";
import buy from "../buycoin/redux/buyReducer";
import invite from "../invite/redux/inviteReducer";

const sagaMiddleware = new createSagaMiddleware();

const Store = createStore(
  combineReducers({
    user,
    wallet,
    skeleton,
    leasing,
    coupons,
    settings,
    payment,
    error,
    assets,
    recharge,
    p2p,
    buy,
    invite
  }),

  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

window.store = Store;

export default Store;
