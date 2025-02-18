import Tabs from './Tabs';
import AttendanceSummary from './AttendanceSummary';
import HistoryTable from './HistoryTable';
import PaymentHistory from '../payment/PaymentHistory';
import PaymentSummary from '../payment/PaymentSummary';
import Header from '../../../Components/Header';

const MainAttendance = () => {
  const jobTabs = ['Job A', 'Job B', 'Job C'];

  const paymentHistory = [
    { date: '2025-01-01', amount: 1500 },
    { date: '2025-01-05', amount: 2000 },
    { date: '2025-01-10', amount: 3000 },
  ];

  const historyData = [
    { date: '2025-01-01', status: 'Present' },
    { date: '2025-01-02', status: 'Absent' },
    { date: '2025-01-01', status: 'Present' },
  ];

  return (
    <div>
      <Header />
      <div  style={{marginTop:"6rem"}}>

      <Tabs tabs={jobTabs}>
        {/* Job A */}
        <div className="row">
          <div className="col-md-6">
            <AttendanceSummary />           
            <HistoryTable data={historyData}/>
          </div>
          <div className="col-md-6">
            <PaymentSummary />
            <PaymentHistory payments={paymentHistory} />
          </div>
        </div>

        {/* Job B */}
        <div className="row">
          <div className="col-md-6">
            <AttendanceSummary />           
            <HistoryTable data={historyData}/>
          </div>
          <div className="col-md-6">
            <PaymentSummary />
            <PaymentHistory payments={paymentHistory} />
          </div>
        </div>

        {/* Job C */}
        <div className="row">
          <div className="col-md-6">
            <AttendanceSummary />           
            <HistoryTable data={historyData}/>
          </div>
          <div className="col-md-6">
            <PaymentSummary />
            <PaymentHistory payments={paymentHistory} />
          </div>
        </div>
      </Tabs>
      </div>
    </div>
  );
};

export default MainAttendance;
