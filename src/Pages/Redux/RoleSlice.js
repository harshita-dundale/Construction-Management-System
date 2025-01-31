import { createSlice } from "@reduxjs/toolkit";
import role1 from "../../assets/images/photos/role1.svg";
import role2 from  "../../assets/images/photos/role2.svg";

const initialState = {
  roles: [
    {
      imgSrc: role1,
      h1Text: "Builder",
      pText:
        "Choose the Builder role to streamline construction, assign tasks, and ensure project success-your key to find skilled workers!",
      buttonText: "Submit",
      route: "/builder-page",
    },
    {
      imgSrc: role2,
      h1Text: "Worker",
      pText:
        "Opt for the Worker role to contribute to construction projects, track tasks, report progress, and collaborate seamlessly!",
      buttonText: "Submit",
      route: "/browse-Job",
    },
  ],
};

const RoleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
});

export const selectRoles = (state) => state.role.roles;

export default RoleSlice.reducer;
