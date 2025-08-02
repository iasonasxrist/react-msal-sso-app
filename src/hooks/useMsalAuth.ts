import { useEffect, useState } from "react";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { loginRequest } from "../utils/msalConfig";
import {
  InteractionRequiredAuthError,
  InteractionType,
  AccountInfo,
} from "@azure/msal-browser";
import { useDispatch, useSelector } from "react-redux";
import { setError, setMsalToken } from "../store/reducers/msalReducer";
import msalInstance from "../utils/msalInstance";
import type { AppDispatch, RootState } from "../store";

export default function useMsalAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { instance, accounts } = useMsal();
  const [refreshTokenInterval, setRefreshTokenInterval] =
    useState<NodeJS.Timeout | null>(null);

  const msalToken = useSelector((state: RootState) => state.msal.msal);
  const loading = useSelector((state: RootState) => state.msal.loading);
  const account = accounts.length > 0 ? accounts[0] : null;

  const { login, result, error } = useMsalAuthentication(
    InteractionType.Silent,
    loginRequest
  );

  useEffect(() => {
    if (error instanceof InteractionRequiredAuthError) {
      console.warn("Silent token acquisition failed, redirecting for login");
      login(InteractionType.Redirect, loginRequest);
    }
  }, [error, login]);

  useEffect(() => {
    if (result?.accessToken) {
      dispatch(setMsalToken({ msalToken: result.accessToken }));
      if (account) {
        instance.setActiveAccount(account);
      }
      if (result.expiresOn) {
        scheduleTokenRefresh(result.expiresOn);
      }
    }
  }, [result, dispatch]);

  const scheduleTokenRefresh = (expiresOn: Date) => {
    const currentTime = new Date().getTime();
    const tokenExpiryTime = expiresOn.getTime();

    if (tokenExpiryTime <= currentTime) {
      console.warn("Token already expired, redirecting to login");
      login(InteractionType.Redirect, loginRequest);
      return;
    }

    const refreshTime = tokenExpiryTime - currentTime - 10 * 60 * 1000;

    if (refreshTime > 0) {
      // console.log(
      //   `Scheduling token refresh in ${refreshTime / 1000 / 60} minutes.`
      // );
      if (refreshTokenInterval) {
        clearTimeout(refreshTokenInterval);
      }

      const interval = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);

      setRefreshTokenInterval(interval);
    }
  };

  const refreshAccessToken = async () => {
    if (!account) {
      login(InteractionType.Redirect, loginRequest);
      return;
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account as AccountInfo,
      });
      // console.log(
      //   `Token refreshed successfully, new expiry: ${response.expiresOn}`
      // );

      if (response?.accessToken) {
        dispatch(setMsalToken({ msalToken: response.accessToken }));
        if (response.expiresOn) {
          // console.log(`New Token expires: ${response.expiresOn}`);
          scheduleTokenRefresh(response.expiresOn);
        }
      }
    } catch (err: any) {
      if (err instanceof InteractionRequiredAuthError) {
        console.warn("Silent token acquisition failed, redirecting for login");
        login(InteractionType.Redirect, loginRequest);
      } else {
        console.error("Silent token acquisition failed: ", err);
        dispatch(setError(err?.message));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (refreshTokenInterval) {
        clearTimeout(refreshTokenInterval);
      }
    };
  }, [refreshTokenInterval]);

  return {
    msalToken,
    loading,
    accounts,
  };
}
