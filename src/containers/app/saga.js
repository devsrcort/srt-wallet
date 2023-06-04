import { takeLatest } from "redux-saga";
import { fork } from "redux-saga/effects";
import {
    authenticateUser,
    createTwoFactorAuth,
    verifyTwoFactorAuth,
    createUser,
    resetUser,
    hasTwoFactorAuth,
    setUserSeed,
    updateUserConsentsSaga,
    editUserData,
    updateUserPasswordSaga,
    sendUserInfo
} from "../user/redux/userSaga";

import {
    loadGeneralInfo,
    loadWalletInfo,
    balanceCoins,
    createCoinsAddress
} from "../skeleton/redux/skeletonSaga";
import {
    getWalletCoinHistory,
    getWalletSendModalFee,
    getCoinFee,
    setWalletTransaction,
    getWalletTransferAvailable
} from "../wallet/redux/walletSaga";

export default function* rootSaga() {
    yield [
        // User-Saga
        fork(takeLatest, "POST_USER_AUTHENTICATE_API", authenticateUser),
        fork(takeLatest, "POST_USER_CREATE_2FA_API", createTwoFactorAuth),
        fork(takeLatest, "POST_USER_VERIFY_2FA_API", verifyTwoFactorAuth),
        fork(takeLatest, "POST_USER_CREATE_USER_API", createUser),
        fork(takeLatest, "POST_USER_RESET_USER_API", resetUser),
        fork(takeLatest, "GET_USER_2FA_API", hasTwoFactorAuth),
        fork(takeLatest, "SET_USER_SEED_API", setUserSeed),
        fork(takeLatest, "UPDATE_USER_CONSENTS_API", updateUserConsentsSaga),
        fork(takeLatest, "EDIT_USER_DATA_API", editUserData),
        fork(takeLatest, "UPDATE_USER_PASSWORD_API", updateUserPasswordSaga),
        fork(takeLatest, "PATH_USER_CONSENTS_API", updateUserConsentsSaga),
        fork(takeLatest, "PATH_USER_DATA_API", editUserData),
        fork(takeLatest, "PATH_USER_PASSWORD_API", updateUserPasswordSaga),
        fork(takeLatest, "POST_USER_INFO_SEND_API", sendUserInfo),

        // Skeleton-Saga
        fork(takeLatest, "GET_GENERAL_INFO_API", loadGeneralInfo),
        fork(takeLatest, "GET_BALANCE_COINS_API", balanceCoins),
        fork(takeLatest, "GET_WALLET_INFO_API", loadWalletInfo),
        fork(takeLatest, "POST_CREATE_COINS_ADDRESS_API", createCoinsAddress),

        // Wallet-Saga
        fork(takeLatest, "GET_WALLET_COIN_HISTORY_API", getWalletCoinHistory),
        fork(takeLatest, "GET_WALLET_MODAL_SEND_FEE_API", getWalletSendModalFee),
        fork(takeLatest, "SET_WALLET_TRANSACTION_API", setWalletTransaction),
        fork(takeLatest, "GET_WALLET_TRANSFER_TOKEN_AVAILALBE_API", getWalletTransferAvailable),

        // Leasing
        fork(takeLatest, "GET_COIN_FEE_API", getCoinFee),
    ];
}