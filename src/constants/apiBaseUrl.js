export const TESTNET = true;
export const BASE_URL = TESTNET ?
    "https://app.dev.srt-wallet.io" :
    "https://app.srt-wallet.io";

export const MAIL_BASE_URL = TESTNET ?
    "https://dev.srt-wallet.io" :
    "https://srt-wallet.io"

export const TETHER_URL = "https://api.omniwallet.org";
export const HEADER_RESPONSE = "Authorization";

export const HEADER_REQUEST = {
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*"
    }
};

export const HEADER_REQUEST_FORM = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*"
    }
};

export const API_HEADER = {
    headers: {
        key: ""
    }
};

export const blockexplorer = {
    SRT: TESTNET ?
        "https://goerli.etherscan.io/tx/" : "https://etherscan.io/tx/",
};