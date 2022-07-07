export const TESTNET = true;
export const BASE_URL = TESTNET ?
    "http://192.168.0.7:33123" :
    // "https://app.dev.srt-wallet.io":
    "https://app.srt-wallet.io";

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
    lunes: TESTNET ?
        "https://blockexplorer-testnet.lunes.io/tx/" : "https://blockexplorer.lunes.io/tx/",
};