import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import msalReducer from "./reducers/msalReducer";
import { logger } from "./middleware/logger";

const msalPersistConfig = {
  key: "msal",
  storage,
};

const persistedMsalReducer = persistReducer(msalPersistConfig, msalReducer);

export const CreateStore = () => {
  return configureStore({
    reducer: {
      msal: persistedMsalReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(logger) as any,
    devTools: import.meta.env.DEV,
  });
};

export const store = CreateStore();

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
