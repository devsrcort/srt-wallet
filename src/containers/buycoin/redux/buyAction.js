export const openModal = open => ({
  type: "SET_MODAL_OPEN",
  open
});

export const setModalStep = step => ({
  type: "SET_MODAL_BUY_STEP",
  step
});

export const getCoinsEnabled = () => ({
  type: "GET_BUY_COINS_ENABLED"
});

export const getCoinForPayment = coin => ({
  type: "GET_COIN_FOR_PAYMENT",
  coin
});

export const getCoinPackage = (id, coin, address) => ({
  type: "GET_COIN_PACKAGE",
  id,
  coin,
  address
});

export const setBuyPackage = (id, amount, amountFiat) => ({
  type: "SET_BUY_PACKAGE",
  package: id,
  amount: amount,
  amountFiat: amountFiat
});

export const setCoinSelected = (coin, address, id) => ({
  type: "SET_BUY_COIN_PAYMENT",
  coin: coin,
  address: address,
  id: id
});

export const getFeeBuy = (
  coin,
  amount,
  fromAddress,
  toAddress,
  decimalPoint
) => ({
  type: "GET_FEE_BUY",
  coin,
  fromAddress,
  toAddress,
  amount,
  decimalPoint
});

export const setFeeBuy = fee => ({
  type: "SET_FEE_BUY",
  fee
});

export const setBuy = payload => ({
  type: "SET_BUY",
  payload
});

export const confirmBuy = buy => ({
  type: "CONFIRM_BUY",
  buy
});

export const getHistoryBuy = coins => ({
  type: "GET_HISTORY_BUY",
  coins
});

export const setClearBuy = () => ({
  type: "SET_CLEAR_BUY_REDUCER"
});

export const setClearBuyPack = () => ({
  type: "SET_CLEAR_BUY_PACK_REDUCER"
});

export const setLoadingHistory = payload => ({
  type: "SET_LOADING_HISTORY",
  payload
});

export const getLunesBuyPrices = coins => ({
  type: "GET_LUNES_BUY_PRICES_API",
  coins
});
