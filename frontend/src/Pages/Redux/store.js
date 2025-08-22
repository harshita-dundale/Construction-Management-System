// import { configureStore } from "@reduxjs/toolkit";
// import builderWorkerReducer from "./CardSlice";
// import roleReducer from "./RoleSlice";
// import usersReducer from "./UsersSlice";
// // import appliModelReducer from './AppliModelSlice'
// import appTabsReducer from "./AppliTabsSlice";
// import builderReducer from "./BuilderSlice";
// import postJobReducer from "./postJobSlice";
// import applicationsReducer from './applicationsSlice';
// import hiredWorkersReducer from './hiredWorkersSlice';
// import materialReducer from "./MaterialSlice";
// import financeReducer from "./FinanceSlice";
// import workerReducer from "./workerSlice";
// import attendanceReducer from "./AttendanceSlice";
// import projectReducer from "./projectSlice";
// import applyJobReducer from "../Redux/ApplyJobSlice";
// import builderJobsReducer from "./builderJobsSlice";
// import payrollReducer from "./PayrollSlice"; // Import the payroll reducer

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
  project: projectReducer, // this will be persisted
  applyJob: applyJobReducer,
  auth: authReducer,
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
export default store;

// const store = configureStore({
//   reducer: {
//     builderWorker: builderWorkerReducer,
//     role: roleReducer,
//     users: usersReducer,
//    // applicationsModel : appliModelReducer,
//     appTabs: appTabsReducer,
//     builder: builderReducer,
//     postJob: postJobReducer,
//     applications: applicationsReducer,
//     hiredWorkers: hiredWorkersReducer,
//     materials: materialReducer,
//     finance: financeReducer,
//     workers: workerReducer,
//     attendance: attendanceReducer,
//     project: projectReducer,
//     applyJob: applyJobReducer,
//     builderJobs: builderJobsReducer,
//     payroll: payrollReducer, // Add the payroll reducer here

//   },
// });
// export default store;