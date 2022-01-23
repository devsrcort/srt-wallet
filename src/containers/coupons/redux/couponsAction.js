export const setVoucherLoading = value => ({
  type: "SET_VOUCHER_LOADING",
  state: value
});

export const getVoucher = (phone, coins, code) => ({
  type: "GET_VOUCHER_API",
  phone,
  coins,
  code
});

export const verifyCoupon = (coupon, coins) => ({
  type: "GET_COUPON_API",
  coupon,
  coins
});
