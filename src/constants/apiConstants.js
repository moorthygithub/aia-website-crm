export const LOGIN = {
  postLogin: "/panel-login",
};
export const PANEL_CHECK = {
  getPanelStatus: "/panel-check-status",
  getEnvStatus: "/panel-fetch-dotenv",
};
export const POPUP_API = {
  list: "/popup",
  byId: (id) => `/popup/${id}`,
};
