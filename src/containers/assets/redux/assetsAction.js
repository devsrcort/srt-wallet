export const getAssetGeneralInfo = (lunesAddress) => ({
  type: "GET_ASSET_GENERAL_INFO_API",
  lunesAddress
})
export const getAssetHistory = (assetId, lunesAddress) => ({
  type: "GET_ASSET_HISTORY_API",
  assetId,
  lunesAddress
})
export const setSelectedCoin = assetId => ({
  type: "POST_ASSETS_SET_SELECTED_COIN",
  assetId
});
export const reloadAsset = (assetId, lunesAddress) => ({
  type: "GET_RELOAD_ASSET_API",
  assetId,
  lunesAddress
})
