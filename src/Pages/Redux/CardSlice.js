import { createSlice } from "@reduxjs/toolkit";
import icon1 from "../../assets/images/icons/icon1.gif"
import icon2 from "../../assets/images/icons/icon2.gif"
import icon3 from "../../assets/images/icons/icon3.gif"
import icon4 from "../../assets/images/icons/icon4.gif"
import worker1 from "../../assets/images/icons/worker1.gif"
import worker2 from "../../assets/images/icons/worker2.gif"

const initialState = {
  cardBuilder: [
    {
      imgSrc: icon1,
      title: "Job Management",
      text: "Simplify job posting and manage all your project listings in one place, connecting with skilled workers.",
      buttonText: "Get Start",
    },
    {
      imgSrc: icon2,
      title: "Worker Management",
      text: "Easily hire, organize, and manage your workforce for optimal productivity on every project.",
      buttonText: "Get Start",
    },
    {
      imgSrc: icon3,
      title: "Material Management",
      text: "Track and manage construction materials efficiently to minimize wastage and reduce costs.",
      buttonText: "Get Start",
    },
    {
      imgSrc: icon4 ,
      title: "Profit / Cost Analysis",
      text: "Monitor project budgets and analyze profit/loss in real time to keep your business on track.",
      buttonText: "Get Start",
    },
  ],
  cardWorker: [
    {
      imgSrc: worker1,
      title: "Browse and Apply for job",
      text: "Explore available projects and apply to the ones that match your skills and expertise.",
      buttonText: "Get start",
    },
    {
      imgSrc: worker2,
      title: "Payment Management",
      text: "Keep track of payments received, pending amounts, and financial summaries.",
      buttonText: "Get start",
    },
  ],
};

const cardSlice = createSlice({
  name: "builderWorker",
  initialState,
  reducers: {},
});

// Updated selector names
export const selectCardBuilder = (state) => state.builderWorker.cardBuilder;
export const selectCardWorker = (state) => state.builderWorker.cardWorker;

export default cardSlice.reducer;
