import { createSlice } from "@reduxjs/toolkit";
import img1 from "../../assets/images/icons/dash3.gif";  
import img2 from "../../assets/images/icons/dash2.gif";  
import img3 from "../../assets/images/icons/dash1.gif";

const initialState = {
  cards: [
    {
       imgSrc: img1,  
      title: "Post and edit job",
      text: "Handle your projects efficiently and track progress.",
      buttonText: "Get Start",
      route: "/post-job",
    },
    {
      imgSrc: img2,  
      title: "View Applications",
      text: "Improve productivity with effective collaborative tools.",
      buttonText: "Get Start",
      route: "/ViewApplications",
    },
    {
      imgSrc: img3,  
      title: "Hired Worker",
      text: "Monitor construction materials to reduce wastage.",
      buttonText: "Get Start",
      route: "/HiredWorkers",
    },
  ],
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    updateCardData: (state, action) => {
      state.cards = action.payload;
    },
  },
});

export const { updateCardData } = builderSlice.actions;
export default builderSlice.reducer;