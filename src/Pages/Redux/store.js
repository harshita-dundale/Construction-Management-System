import { configureStore } from "@reduxjs/toolkit";
import builderWorkerReducer from "./CardSlice";
import roleReducer from "./RoleSlice";
import usersReducer from "./UsersSlice";
import appliModelReducer from './AppliModelSlice'
import appTabsReducer from "./AppliTabsSlice";
import attendanceReducer from "./AttendanceSlice";

const store = configureStore({
  reducer: {
    builderWorker: builderWorkerReducer,
    role: roleReducer,
    users: usersReducer,
    applicationsModel : appliModelReducer,
    appTabs: appTabsReducer,
    attendance: attendanceReducer,
  },
});

export default store;
