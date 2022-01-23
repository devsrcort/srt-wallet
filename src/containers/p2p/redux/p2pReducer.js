const initialState = {
  userId: undefined, //TODO remove
  chat: {
    iduser: null
  },
  chatOpened: false, //TODO remove
  chatDetails: {
    myId: undefined,
    open: false,
    currentOrder: undefined, //{buy: {...}, sell: {...} chat: { rooms: [] }}
    seller: undefined, //{id: ''}
    buyer: undefined, //{id: '', name: '', surname: '', email: ''}
    typeOfUser: undefined, // 'seller' || 'buyer'
    currentRoom: undefined
  },
  openDeposit: false,
  isDepositBuy: false,
  openAvaliation: false,
  loading: false,
  loadingCreateOrder: false,
  modalStep: 1,
  modalOpen: false,
  depositConfirmIsOpen: false,
  orders: [],
  coinsEnabled: [],
  currentOrder: {
    // I think its not being used
    //this should come from the API
    orderId: "1",
    isOwner: false
  },
  buy: {
    availableCoinsToBuy: [
      { title: "LUNES", img: "images/icons/coins/lunes.png" },
      { title: "BTC", img: "images/icons/coins/btc.png" },
      { title: "DASH", img: "images/icons/coins/dash.png" }
    ],
    coinToBuy: {
      title: "Lunes",
      img: "images/icons/coins/lunes.png"
    },
    paymentMethods: [],
    paymentMethod: {}
  },
  cancelDone: false,
  tabIcon: 0,
  userProfile: [],
  profile: {},
  order: []
};

const p2p = (state = initialState, action) => {
  switch (action.type) {
    case "CHAT_DETAILS_SETTER":
      return {
        ...state,
        chatDetails: {
          ...state.chatDetails,
          ...action.payload
        }
      };
    case "SET_USER_ID":
      return {
        ...state,
        userId: action.id
      };
    case "SETTER":
      return {
        ...state,
        ...action.data
      };
    case "BUY_SETTER":
      return {
        ...state,
        buy: {
          ...state.buy,
          ...action.data
        },
        coinsEnabled: action.data
      };
    case "OPEN_CHAT_P2P_REDUCER":
      return {
        ...state,
        chatOpened: true,
        chat: {
          ...state.chat,
          iduser: action.iduser
        }
      };

    case "HANDLE_CONFIRM_SELL_P2P":
      return {
        ...state,
        depositConfirmIsOpen: action.isOpen,
        openDeposit: false,
        isDepositBuy: action.isDepositBuy
      };

    case "CLOSE_CHAT_P2P_REDUCER":
      return {
        ...state,
        chatOpened: false
      };

    case "SET_MODAL_FLOW_STEP_REDUCER":
      return {
        ...state,
        modalStep: action.step
      };

    case "SET_MODAL_OPEN_REDUCER":
      return {
        ...state,
        modalOpen: action.open
      };

    case "SET_P2P_CANCEL_ORDERS_REDUCER":
      return {
        ...state,
        loading: false,
        cancelDone: true
      };

    case "CLEAR_CANCEL_P2P":
      return {
        ...state,
        cancelDone: false
      };

    case "GET_MY_ORDERS_REDUCER":
      return {
        ...state,
        orders: action.orders,
        loading: false
      };

    case "GET_HISTORY_REDUCER":
      return {
        ...state,
        orders: action.orders,
        loading: false
      };

    case "GET_FILTER_REDUCER":
      return {
        ...state,
        orders: action.orders,
        loading: false
      };

    case "SET_LOADING_P2P":
      return {
        ...state,
        loading: action.loading
      };

    case "SET_LOADING_CREATE_OFFER":
      return {
        ...state,
        loadingCreateOrder: action.loading
      };

    case "CREATE_OFFER_DONE":
      return {
        ...state,
        loadingCreateOrder: false,
        createDone: true
      };

    case "CREATE_OFFER_ERROR":
      return {
        ...state,
        loadingCreateOrder: false,
        createError: true
      };

    case "CREATE_OFFER_CLEAR":
      return {
        ...state,
        loadingCreateOrder: false,
        createDone: false,
        createError: false
      };

    case "OPEN_DEPOSIT_P2P_REDUCER":
      return {
        ...state,
        openDeposit: true,
        chat: {
          ...state.chat,
          iduser: action.order
        }
      };

    case "CLOSE_DEPOSIT_P2P_REDUCER":
      return {
        ...state,
        openDeposit: false
      };

    case "OPEN_AVALIATION_P2P_REDUCER":
      return {
        ...state,
        openAvaliation: true,
        order: action.order
      };

    case "CLOSE_AVALIATION_P2P_REDUCER":
      return {
        ...state,
        openAvaliation: false,
        tabIcon: 1
      };

    case "SET_TAB_ICON_REDUCER":
      return {
        ...state,
        tabIcon: action.tabIcon
      };

    case "SET_USER_PROFILE_REDUCER":
      return {
        ...state,
        tabIcon: 2,
        userProfile: action.userProfile,
        chatOpened: false
      };

    case "GET_PROFILE_REDUCER":
      return {
        ...state,
        profile: action.profile,
        loading: false
      };

    case "CLEAR_USER_PROFILE":
      return {
        ...state,
        userProfile: [],
        profile: {}
      };

    case "SET_USER_DESCRIPTION":
      return {
        ...state,
        profile:{
          ...state.profile,
          description: action.profile
        }
      };


    default: {
      return {
        ...state
      };
    }
  }
};

export default p2p;
