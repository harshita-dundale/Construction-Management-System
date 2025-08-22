import { configureStore } from "@reduxjs/toolkit";
import builderWorkerReducer from "./CardSlice";
import roleReducer from "./RoleSlice";
import usersReducer from "./UsersSlice";
import appTabsReducer from "./AppliTabsSlice";
import builderReducer from "./BuilderSlice";
import postJobReducer from "./PostJobSlice";
import applicationsReducer from './applicationsSlice';
import hiredWorkersReducer from './hiredWorkersSlice';
import materialReducer from "./MaterialSlice";
import financeReducer from "./FinanceSlice";
import workerReducer from "./workerSlice";
import attendanceReducer from "./AttendanceSlice";
import projectReducer from "./projectSlice";
import applyJobReducer from "../Redux/ApplyJobSlice";
import authReducer from "../Redux/authSlice";
import PayrollReducer from "./PayrollSlice";
import storage from 'redux-persist/lib/storage'; // localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

// ✅ Persist only the project slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['project'],
};

// ✅ Combine all reducers including project
const rootReducer = combineReducers({
  builderWorker: builderWorkerReducer,
  role: roleReducer,
  users: usersReducer,
  appTabs: appTabsReducer,
  builder: builderReducer,
  postJob: postJobReducer,
  applications: applicationsReducer,
  hiredWorkers: hiredWorkersReducer,
  materials: materialReducer,
  finance: financeReducer,
  workers: workerReducer,
  attendance: attendanceReducer,
  project: projectReducer, 
  applyJob: applyJobReducer,
  auth: authReducer,
  Payroll:PayrollReducer,
});

// ✅ Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure the store
export const store = configureStore({
  reducer: persistedReducer, // 👈 use persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist to avoid errors
    }),
});

export const persistor = persistStore(store);
// export default store;
