import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user.slice';

const reducer = combineReducers({
  auth: userReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
