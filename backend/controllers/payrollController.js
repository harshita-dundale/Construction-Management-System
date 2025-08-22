import Payroll from '../models/payroll.js';
import User from "../models/user.js";
import Application from "../models/application.js";
import Job from "../models/job.js";
import Attendance from "../models/WorkerRecord.js";

const payrollController = {
  getPayrollsByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const payrolls = await Payroll.find({ projectId })
        .populate('workerId', 'name email')
        .populate('jobId', 'title paymentPerDay')
        .populate('projectId', 'name');

      res.json(payrolls);
    } catch (error) {
      console.error("Get Payrolls Error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createPayroll: async (req, res) => {
    try {
      const {
        workerId, jobId, projectId,
        month, paymentDate,
        paidAmount, totalSalary,
        present, absent
      } = req.body;

      let existing = await Payroll.findOne({ workerId, projectId, month });

      if (!existing) {
        const newEntry = new Payroll({
          workerId, jobId, projectId,
          month,
          paymentDates: [paymentDate],
          paidAmounts: [paidAmount],
          totalSalary,
          balance: totalSalary - paidAmount,
          present, absent,
          status: paidAmount === totalSalary ? 'Paid' : 'Partial'
        });
        await newEntry.save();
        res.status(201).json(newEntry);
      } else {
        existing.paymentDates.push(paymentDate);
        existing.paidAmounts.push(paidAmount);
        const totalPaid = existing.paidAmounts.reduce((a, b) => a + b, 0);
        existing.balance = totalSalary - totalPaid;
        existing.status = totalPaid === totalSalary ? 'Paid' : 'Partial';
        await existing.save();
        res.status(200).json(existing);
      }
    } catch (error) {
      console.error("Create Payroll Error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getPayrollByWorker: async (req, res) => {
    try {
      const { workerId } = req.params;
      const history = await Payroll.find({ workerId }).sort({ month: -1 });
      res.json(history);
    } catch (error) {
      console.error("Get Payroll History Error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};
export default payrollController;
// controllers/paymentController.js

export const getFullPaymentHistoryByEmail = async (req, res) => {
  const { email } = req.query;
  console.log("🔍 Looking up full payment history for:", email);

  if (!email) {
    return res.status(400).json({ error: "Email is required in query params" });
  }

  try {
    const worker = await User.findOne({ email });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const acceptedApplications = await Application.find({
      email,
      status: "joined",
    });
    console.log("acceptedApplications are", acceptedApplications);

    if (!acceptedApplications.length) {
      return res.status(404).json({ error: "No accepted jobs found for worker" });
    }

    const results = [];

    for (const application of acceptedApplications) {
      const {_id: applicationId,  jobId, projectId } = application;

 console.log("🔎 Searching payment for:");
    // console.log("  jobtitle:", jobTitle.toString());
     console.log("  projectId:", projectId.toString());
    // console.log("  workerId :", applicationId.toString());
    console.log("  workerId :", worker._id.toString());

      const payrollRecord = await Payroll.findOne({
        jobId,
        projectId,
       workerId: applicationId,
       // workerId: worker._id,
      });
      
     console.log("📄 payrollRecord found:", payrollRecord);
//console.log("👀 workers array:", payrollRecord?.workers);

if (payrollRecord) {
  const {
    totalSalary = 0,
    paidAmounts = [],
    paymentDates = [],
    status: paymentStatus = "Unpaid"
  } = payrollRecord;

  const job = await Job.findById(jobId).select("jobTitle");
  if (!job) {
    console.log("❌ No job found for jobId:", jobId);
  }
  
  // Create individual entries for each payment
  if (paidAmounts.length > 0 && paymentDates.length > 0) {
    for (let i = 0; i < paidAmounts.length; i++) {
      results.push({
        jobId,
        projectId,
        jobTitle: job?.jobTitle || "Untitled",
        paidAmount: paidAmounts[i] || 0,
        totalSalary,
        paymentDate: paymentDates[i] ? new Date(paymentDates[i]).toISOString().slice(0, 10) : "-",
        paymentStatus,
      });
    }
  }
}

    }
    console.log("✅ Final response:", results);
    
    res.status(200).json(results);

  } catch (error) {
    console.error("❌ Error fetching payment history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const calculatePayroll = async (req, res) => {
  const { email, month, year } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

    let payrollData = [];
    let totalEarnings = 0;

    for (const app of applications) {
      if (!app.jobId) continue;

      let dateFilter = { workerId: app._id, projectId: app.projectId };
      
      // Add month/year filter if provided
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        dateFilter.date = { $gte: startDate, $lte: endDate };
      }

      const attendanceRecords = await Attendance.find(dateFilter);
      
      const dailySalary = app.jobId.salary / 30;
      let jobEarnings = 0;
      let presentDays = 0;

      attendanceRecords.forEach((rec) => {
        if (rec.status === "Present") {
          presentDays++;
          jobEarnings += dailySalary;
        }
      });

      if (presentDays > 0) {
        payrollData.push({
          jobTitle: app.jobId.title,
          dailySalary: Math.round(dailySalary),
          presentDays,
          jobEarnings: Math.round(jobEarnings)
        });
        totalEarnings += jobEarnings;
      }
    }

    res.status(200).json({
      payrollData,
      totalEarnings: Math.round(totalEarnings),
      month: month || "All",
      year: year || "All"
    });
  } catch (error) {
    console.error("Error calculating payroll:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔍 DEBUG Function - Check attendance data
// 📋 GET All Attendance Records
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate('workerId', 'name email')
      .populate('projectId', 'title')
      .sort({ date: -1 });
    
    res.json({
      total: attendanceRecords.length,
      records: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const debugAttendance = async (req, res) => {
  const { email } = req.query;
  
  try {
    const applications = await Application.find({ 
      email, 
      status: "accepted", 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }).populate("jobId");

    console.log(`📧 Email: ${email}`);
    console.log(`📋 Applications found: ${applications.length}`);
    
    for (const app of applications) {
      console.log(`\n🔹 Application ID: ${app._id}`);
      console.log(`🔹 Project ID: ${app.projectId}`);
      console.log(`🔹 Job: ${app.jobId?.title}`);
      
      const attendanceRecords = await Attendance.find({
        workerId: app._id,
        projectId: app.projectId
      });
      
      console.log(`📊 Attendance records: ${attendanceRecords.length}`);
      attendanceRecords.forEach(rec => {
        console.log(`   📅 ${rec.date.toDateString()} - ${rec.status}`);
      });
    }
    
    res.json({ message: "Check console for debug info" });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Debug failed" });
  }
};