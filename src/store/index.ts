import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { leadsApi } from './leadsApi';
import { blogApi } from './blogApi';

export const store = configureStore({
  reducer: {
    [leadsApi.reducerPath]: leadsApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(leadsApi.middleware, blogApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
