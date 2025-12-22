import Cookies from "js-cookie";

export const getAuthToken = (reduxToken) => {
  if (reduxToken) return reduxToken;

  const cookieToken = Cookies.get("access_token");
  if (cookieToken) return cookieToken;

  return null;
};
