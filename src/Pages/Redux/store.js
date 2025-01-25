import { configureStore } from "@reduxjs/toolkit";
import builderWorkerReducer from "./CardSlice";
import roleReducer from "./RoleSlice";
import usersReducer from "./UsersSlice";
import appliModelReducer from './AppliModelSlice'
import appTabsReducer from "./AppliTabsSlice";
const store = configureStore({
  reducer: {
    builderWorker: builderWorkerReducer,
    role: roleReducer,
    users: usersReducer,
    applicationsModel : appliModelReducer,
    appTabs: appTabsReducer,
  },
});

export default store;
