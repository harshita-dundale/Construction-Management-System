import Header from "../../Components/Header";
import Attendance from "../../Components/TrackBilling/Attendance";
import Profile from "../../Components/TrackBilling/Profile";
import Payment from "../../Components/TrackBilling/Payment";
import Chart from "../../Components/TrackBilling/Chart";
import Tasks from "../../Components/TrackBilling/Tasks";

function TrackBilling(){

  return(
    <>
    <Header/>
    <div className="container mt-5">
      <div className="row d-flex align-items-center">
        <div className="col-md-6">
          <Profile/>
        </div>
        <div className="col-md-6">
          <Attendance/>
        </div>
        </div>
        </div>

     <div className="container-fluid mt-5">
       <div className="row">
        <div className="col-md-6">
          <Chart/>
        </div>
        <div className="col-md-6">
        <Payment/>         
        </div>
       </div>
       </div>

       <div className="container mt-5">
       <div className="row">
       <Tasks/>
       </div> 
       </div>
    </>
  )
}
export default TrackBilling;