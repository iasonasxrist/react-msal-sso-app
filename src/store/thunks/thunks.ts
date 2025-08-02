import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPublicClientApplication } from "@azure/msal-browser";
import { axioSign } from "../../api/axiosInstance";
import { AppDispatch, RootState } from "../../store/index";
import { clearMsalToken } from "../reducers/msalReducer";

// Shared types
interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Generic error handler
const handleApiError = (error: any): ApiError => {
  return {
    message: error.response?.data?.message || error.message,
    status: error.response?.status,
    data: error.response?.data,
  };
};

// Enhanced logout thunk with proper typing
export const logoutThunk = createAsyncThunk<
  void,
  IPublicClientApplication,
  { dispatch: AppDispatch }
>("msalAuth/logout", async (instance, { dispatch }) => {
  try {
    await instance.logoutRedirect();
    dispatch(clearMsalToken());
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
});

// Generic API call wrapper
const makeApiCall = async <T>(
  method: "get" | "post" | "patch" | "delete",
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await axioSign[method]<T>(url, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Strongly typed user fetching
interface User {
  id: string;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const fetchUsers = createAsyncThunk<User[], void, { state: RootState }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await makeApiCall<User[]>("get", "/User/GetAllUsers");

      return users
        .filter((user) => user.fullName?.trim())
        .map((user) => {
          const [firstName, ...lastNameParts] = user.fullName
            .trim()
            .split(/\s+/);
          return {
            ...user,
            firstName,
            lastName: lastNameParts.join(" "),
          };
        })
        .sort(
          (a, b) =>
            a.lastName.localeCompare(b.lastName) ||
            a.firstName.localeCompare(b.firstName)
        );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchUserRoles = createAsyncThunk(
  "roles/fetchUserRoles",
  async (entraID: string, { rejectWithValue }) => {
    try {
      const response = await axioSign.get(`/Role/GetUserRoles/${entraID}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch roles");
    }
  }
);
