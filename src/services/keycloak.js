import Keycloak from "keycloak-js";

const initOptions = {
  url: "http://localhost:8181/",
  realm: "InnoVest_Auth",
  clientId: "react-client",
};

let keycloakInstance = null;
let initializationPromise = null;

const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(initOptions);
  }
  return keycloakInstance;
};

export const initKeycloak = () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  const keycloak = getKeycloakInstance();
  initializationPromise = keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: true,
    pkceMethod: "S256",
  });

  return initializationPromise;
};

export const login = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.login();
};

export const logout = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.logout();
};

export const getToken = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.token;
};

export const isAuthenticated = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.authenticated;
};

export default getKeycloakInstance();
