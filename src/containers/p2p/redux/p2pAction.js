export const openChat = iduser => ({
  type: "OPEN_CHAT_P2P",
  iduser
});

export const handleConfirmSell = (isOpen, isDepositBuy) => ({
  type: "HANDLE_CONFIRM_SELL_P2P",
  isOpen,
  isDepositBuy
});

export const closeChat = () => ({
  type: "SAGA_CLOSE_CHAT"
});

export const setModalStep = step => ({
  type: "SET_MODAL_FLOW_STEP",
  step
});

export const openModal = open => ({
  type: "SET_MODAL_OPEN",
  open
});

export const getMyOrders = coin => ({
  type: "GET_P2P_MY_ORDERS",
  coin
});

export const getHistory = (coin, historyType) => ({
  type: "GET_P2P_HISTORY",
  coin,
  historyType
});

export const getFilter = (typeOrder, coinBuy) => ({
  type: "GET_P2P_FILTER",
  typeOrder,
  coinBuy
});

export const setter = data => ({
  type: "SETTER",
  data
});

export const buySetter = data => ({
  type: "BUY_SETTER",
  data
});

export const getPaymentMethodsWhenBuying = coin => ({
  type: "API_GET_PAYMENT_METHODS_WHEN_BUYING",
  coin
});

export const acceptOfferWhenBuying = data => ({
  type: "API_ACCEPT_OFFER_WHEN_BUYING",
  data
});

export const createOfferWhenSelling = data => ({
  type: "API_CREATE_OFFER_WHEN_SELLING",
  data
});

export const setCancelOrder = orderId => ({
  type: "SET_P2P_CANCEL_ORDERS",
  orderId
});

export const createSignature = data => ({
  type: "API_P2P_CREATE_CREATE_SIGNATURE",
  data
});

export const clearCancel = () => ({
  type: "CLEAR_CANCEL_P2P"
});

export const clearOffer = () => ({
  type: "CREATE_OFFER_CLEAR"
});

export const openDeposit = order => ({
  type: "OPEN_DEPOSIT_P2P",
  order
});

export const closeDeposit = () => ({
  type: "CLOSE_DEPOSIT_P2P"
});

export const setUserId = () => ({
  type: "SET_USER_ID_P2P"
});

export const chatDetailsSetter = payload => ({
  type: "CHAT_DETAILS_SETTER",
  payload
});

export const prepareOrOpenChat = order => ({
  type: "SAGA_PREPARE_OR_OPEN_CHAT",
  order
});

export const openChatToTheSeller = buyer => ({
  type: "SAGA_OPEN_CHAT_TO_THE_SELLER",
  buyer
});

export const openAvaliation = order => ({
  type: "OPEN_AVALIATION_P2P",
  order
});

export const closeAvaliation = () => ({
  type: "CLOSE_AVALIATION_P2P"
});

export const setTabIcon = tabIcon => ({
  type: "SET_TAB_ICON",
  tabIcon
});

export const setUserProfile = userProfile => ({
  type: "SET_USER_PROFILE_REDUCER",
  userProfile
});

export const getProfile = profile => ({
  type: "GET_PROFILE_API",
  profile
});

export const clearUserProfile = () => ({
  type: "CLEAR_USER_PROFILE"
});
export const setRatingOrder = data => ({
  type: "SET_P2P_RATING_ORDER",
  data
});

export const confirmOrder = idOrder => ({
  type: "POST_CONFIRM_ORDER_API",
  idOrder
});

export const setUserDescription = profile => ({
  type: "SET_USER_DESCRIPTION_API",
  profile
})
