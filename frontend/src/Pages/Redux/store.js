import { configureStore } from "@reduxjs/toolkit";
import builderWorkerReducer from "./CardSlice";
import roleReducer from "./RoleSlice";
import usersReducer from "./UsersSlice";
import appliModelReducer from './AppliModelSlice'
import appTabsReducer from "./AppliTabsSlice";
import builderReducer from "./BuilderSlice";
import postJobReducer from "./postJobSlice";
import applicationsReducer from './applicationsSlice';
import hiredWorkersReducer from './hiredWorkersSlice';
import materialReducer from "./MaterialSlice";
import financeReducer from "./financeSlice";
import workerReducer from "./workerSlice";
import attendanceReducer from "./AttendanceSlice";
import applyJobReducer from "./ApplyJobSlice";
const store = configureStore({
  reducer: {
    builderWorker: builderWorkerReducer,
    role: roleReducer,
    users: usersReducer,
    applicationsModel : appliModelReducer,
    appTabs: appTabsReducer,
    builder: builderReducer,
    postJob: postJobReducer,
    applications: applicationsReducer,
    hiredWorkers: hiredWorkersReducer,
    materials: materialReducer,
    finance: financeReducer,
    workers: workerReducer,
    attendance: attendanceReducer,
    applyJob: applyJobReducer,
  },
});
export default store;