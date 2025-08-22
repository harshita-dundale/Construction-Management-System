import Payroll from '../models/payroll.js';
import User from "../models/user.js";
import Application from "../models/application.js";
import Job from "../models/job.js";

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
      status: "accepted",
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

if (payrollRecord) {
  const {
    totalSalary = 0,
    paidAmounts = [],
    paymentDates = [],
    status: paymentStatus = "Unpaid"
  } = payrollRecord;

  const totalPaid = paidAmounts.reduce((sum, amt) => sum + amt, 0);
  const lastPaymentDate = paymentDates.length
    ? new Date(paymentDates[paymentDates.length - 1]).toISOString().slice(0, 10)
    : "-";
    const job = await Job.findById(jobId).select("jobTitle");
    if (!job) {
      console.log("❌ No job found for jobId:", jobId);
    }
    
  results.push({
    jobId,
    projectId,
    //jobTitle,
    jobTitle: job?.jobTitle || "Untitled",
    paidAmount: totalPaid,
    totalSalary,
    paymentDate: lastPaymentDate,
    paymentStatus,
  });
}

    }
    console.log("✅ Final response:", results);
    
    res.status(200).json(results);

  } catch (error) {
    console.error("❌ Error fetching payment history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};