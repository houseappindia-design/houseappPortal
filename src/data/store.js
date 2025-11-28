import { configureStore } from '@reduxjs/toolkit';
import authReducer  from './slices/authSlice';
import alertReducer from './slices/alertSlice'
import agentReducer from './slices/agentSlice';
import usrReducer from './slices/userSlice'
import employeeReducer from './slices/employeeSlice'
import notificationReducer from './slices/notificationSlice';
import locationsReducer from './slices/locationSlice'
import interactionsReducer from './slices/interactionsSlice';
import bannerReducer  from './slices/bannerSlice'
import aboutReducer from './slices/aboutSlice';
import privacyPolicyReducer from './slices/privacyPolicySlice';
import termsReducer from './slices/termsSlice';
import contactReducer from './slices/contactSlice'
import loginscreenReducer from './slices/loginscreenSlice';







export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    agents: agentReducer,
    user:usrReducer,
    employee:employeeReducer,
    notifications: notificationReducer,
    location:locationsReducer,
    interactions: interactionsReducer,
    banner:bannerReducer,
    about: aboutReducer,
    contact:contactReducer,
    privacyPolicy: privacyPolicyReducer,
    terms: termsReducer,
    loginscreen: loginscreenReducer,
    // other reducers...
  },
});