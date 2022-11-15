import cookie from "js-cookie";

export const setCookie = (key, value) => {
  if (window) {
    cookie.set(key, value);
  }
};

export const removeCookie = (key) => {
  if (window) {
    cookie.remove(key);
  }
};

export const getCookie = (key) => {
  if (window) {
    return cookie.get(key);
  }
};

export const isAuth = () => {
  if (window) {
    const cookieCheck = getCookie("user");
    if (!cookieCheck) {
      return false;
    }
    return true;
  }
};
