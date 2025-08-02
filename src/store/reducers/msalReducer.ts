import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MsalState {
  msal: string | null;
  loading: boolean;
  error: string | null;
}

interface SetTokenPayload {
  msalToken: string;
}

const initialState: MsalState = {
  msal: null,
  loading: false,
  error: null,
};

const msalSlice = createSlice({
  name: "msal",
  initialState,
  reducers: {
    setMsalToken: (state, action: PayloadAction<SetTokenPayload>) => {
      state.msal = action.payload.msalToken;
      state.error = null;
    },
    clearMsalToken: (state) => {
      state.msal = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMsalToken, clearMsalToken, setLoading, setError } =
  msalSlice.actions;
export type { MsalState };
export default msalSlice.reducer;
