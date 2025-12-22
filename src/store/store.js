// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // for localStorage fallback
import { CookieStorage } from "redux-persist-cookie-storage";
import UniversalCookie from "universal-cookie";
import { encryptTransform } from "redux-persist-transform-encrypt";

import authReducer from "./auth/authSlice";
import companyReducer from "./auth/companySlice";
import versionReducer from "./auth/versionSlice";

const secretKey = import.meta.env.VITE_SECRET_KEY;

// Create cookie storage for Redux Persist
const cookies = new UniversalCookie();
const cookieStorage = new CookieStorage(cookies, {
  secure: true,
  sameSite: "strict",
  path: "/",
});

// Persist configs
const authPersistConfig = {
  key: "auth",
  storage: cookieStorage, // use cookie storage
  whitelist: ["token", "user", "version"], // keys you want to persist
  transforms: secretKey
    ? [
        encryptTransform({
          secretKey,
          onError: (error) => console.error("Encryption Error:", error),
        }),
      ]
    : [],
};

const companyPersistConfig = {
  key: "company",
  storage, // fallback to localStorage
};

const versionPersistConfig = {
  key: "version",
  storage, // fallback to localStorage
};

// Combine reducers with persist
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  company: persistReducer(companyPersistConfig, companyReducer),
  version: persistReducer(versionPersistConfig, versionReducer),
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);
