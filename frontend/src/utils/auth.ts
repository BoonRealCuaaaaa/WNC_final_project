export const AUTH_KEY = {
  ACCESS_TOKEN: "app_access_token",
  REFRESH_TOKEN: "app_refresh_token",
  ROLE: "app_role",
  USER_NAME: "app_user_name",
  EMAIL: "app_email",
};

export const setAccessToken = (token: string) => {
  localStorage.setItem(AUTH_KEY.ACCESS_TOKEN, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(AUTH_KEY.ACCESS_TOKEN);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem(AUTH_KEY.REFRESH_TOKEN, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(AUTH_KEY.REFRESH_TOKEN);
};

export const setRole = (role: string) => {
  localStorage.setItem(AUTH_KEY.ROLE, role);
};

export const getRole = () => {
  return localStorage.getItem(AUTH_KEY.ROLE);
};

export const setUserName = (userName: string) => {
  localStorage.setItem(AUTH_KEY.USER_NAME, userName);
};

export const getUserName = () => {
  return localStorage.getItem(AUTH_KEY.USER_NAME);
};

export const setEmail = (email: string) => {
  localStorage.setItem(AUTH_KEY.EMAIL, email);
};

export const getEmail = () => {
  return localStorage.getItem(AUTH_KEY.EMAIL);
};
export const removeTokens = () => {
  localStorage.removeItem(AUTH_KEY.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_KEY.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEY.ROLE);
  localStorage.removeItem(AUTH_KEY.USER_NAME);
  localStorage.removeItem(AUTH_KEY.EMAIL);
};
