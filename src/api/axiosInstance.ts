import axios from "axios";
import { store } from "../store";
import {
  clearMsalToken,
  setError,
  setMsalToken,
} from "../store/reducers/auth/msalReducer";
import msalInstance from "../utils/msalInstance";
import { loginRequest } from "../utils/msalConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const axioSign = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "true",
    "Ocp-Apim-Subscription-Key": "AZURE_SUBSCRIPTION_KEY", // Replace with your actual subscription key
  },
});

export const setAxiosAuthInterceptor = (account) => {
  axioSign.interceptors.request.use(async (config) => {
    const state = store.getState();
    const msalToken = state.msal.msal;

    if (msalToken) {
      config.headers["Authorization"] = `Bearer ${msalToken}`;
    } else {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: account,
        });
        store.dispatch(setMsalToken({ msalToken: response.accessToken }));
        config.headers["Authorization"] = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error("Silent token refresh failed:", error);
        if (error instanceof InteractionRequiredAuthError) {
          await msalInstance.loginRedirect(loginRequest);
        } else {
          store.dispatch(setError(error.message));
          return Promise.reject(error);
        }
      }
    }

    return config;
  });

  axioSign.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { dispatch } = store;
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized! Attempting token refresh.");

        try {
          const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: account,
          });
          dispatch(setMsalToken({ msalToken: response.accessToken }));

          error.config.headers[
            "Authorization"
          ] = `Bearer ${response.accessToken}`;
          return axioSign(error.config);
        } catch (err) {
          console.error("Token refresh failed, logging out.", err);
          dispatch(clearMsalToken());

          await msalInstance.logoutRedirect();
          return Promise.reject(error);
        }
      } else {
        console.error("An error occurred:", error);
        dispatch(setError(error.message));
        return Promise.reject(error);
      }
    }
  );
};

export { axioSign };
