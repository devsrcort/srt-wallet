export const setInviteModal = payload => ({
  type: "SET_INVITE_MODAL",
  payload
});

export const getInviteAddress = () => ({
  type: "GET_INVITE_ADDRESS"
});

export const getInviteBalance = address => ({
  type: "GET_INVITE_BALANCE",
  address
});

export const sendMailInvite = email => ({
  type: "SEND_MAIL_INVITE",
  email
});

export const getInviteSent = () => ({
  type: "GET_INVITE_SENT"
});

export const clearState = () => ({
  type: "CLEAR_INVITE_STATE"
});

export const sendWithdraw = address => ({
  type: "SEND_WITHDRAW_INVITE",
  address
});
