
import { useSelector } from "react-redux";
import Tabs from "./Tabs";
import PaymentSummary from "../payment/PaymentSummary";
import Header from "../../../Components/Header";

const MainAttendance = () => {
  const jobTabs = useSelector((state) => state.attendance.jobTabs);
  return (
    <div>
      <Header />
      <div style={{ marginTop: "6rem"}}>
        <Tabs tabs={jobTabs}>
          {jobTabs.map((job, index) => (
            <div key={index} >
              <PaymentSummary />
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
export default MainAttendance;
