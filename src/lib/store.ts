import { configureStore } from '@reduxjs/toolkit';

import ApplicationReducer from './features/applications/applicationSlice';
import JobStateReducer from './features/jobs/jobSlice';
import AuthStateReducer from './features/users/authSlice';
import UserStateReducer from './features/users/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authState: AuthStateReducer,
      userState: UserStateReducer,
      jobState: JobStateReducer,
      applicationState: ApplicationReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];