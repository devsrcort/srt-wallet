import i18n from "./../../../utils/i18n";
import style from "./style.css";
import { convertISO8601 } from "./../../../utils/numbers.js";
import { chat } from "./../../../constants/apiBaseUrl.js"

export const getChatBundle = (data = {}) => {
  try {
    let { componentId, namespace, adId, adOwnerId, buyerId } = data;
    let bundlesWrapperEL = document.querySelector(".bundlesWrapper");
    let bundleEL = document.createElement("script");
    namespace = namespace || "p2p";
    componentId = componentId || "chatTarget";
    adId =
      adId ||
      (() => {
        throw new Error("adId is not defined");
      })();
    adOwnerId =
      adOwnerId ||
      (() => {
        throw new Error("adOwnerId is not defined");
      })();
    buyerId =
      buyerId ||
      (() => {
        throw new Error("buyerId is not defined");
      })();
    bundleEL.src = chat.getUrl(componentId, namespace, adId, adOwnerId, buyerId);
    bundleEL.type = "text/javascript";
    bundlesWrapperEL.appendChild(bundleEL);
  } catch (err) {
    console.error(err);
    window.store.dispatch({
      type: "REQUEST_FAILED",
      message: i18n.t("P2P_CHAT_FAILED_TO_OPEN")
    });
  }
};

export const awaitChatLoadUp = () => {
  return new Promise(resolve => {
    //eslint-disable-line
    let interval = setInterval(() => {
      let chatBodyEL = document.querySelector(".chatBody");
      if (!chatBodyEL) return;
      let baseEL = chatBodyEL.querySelector(".base");
      if (!baseEL) return;
      resolve(true);
      clearInterval(interval);
    }, 500);
  });
};
export const appendFinalMessage = async (timestamp, cancelled = false) => {
  await awaitChatLoadUp()
  let type = cancelled ? "CANCELED" : "FINISHED";
  let time = convertISO8601(timestamp);
  let baseEL = document.querySelector(".base");
  let line = document.createElement("div");
  line.className = style.line;
  let message = document.createElement("div");
  message.className = style.message;
  message.textContent = i18n.t(`P2P_CHAT_NEGOTIATION_${type}_AT`) + time.date;
  let finalMessage = document.createElement("div");
  finalMessage.className = style.finalMessage;
  finalMessage.appendChild(line);
  finalMessage.appendChild(message);
  let prev = baseEL.querySelector(`.${style.finalMessage}`)
  if (prev) prev.style.display = 'none'
  baseEL.appendChild(finalMessage)
};

export const removeChatTargetScroll = async () => {
  await awaitChatLoadUp()
  let chatTargetEL = document.querySelector('.chatTarget')
  if (!chatTargetEL) return;
  chatTargetEL.style.overflow = 'hidden'
}
