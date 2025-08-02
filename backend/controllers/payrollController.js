// import Payroll from '../models/payroll.js';

// const payrollController = {
//   getPayrollsByProject: async (req, res) => {
//     try {
//       const { projectId } = req.params;
//       const payrolls = await Payroll.find({ projectId })
//         .populate('workerId', 'name email')
//         .populate('jobId', 'title paymentPerDay')
//         .populate('projectId', 'name');

//       res.json(payrolls);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   },

//   createPayroll: async (req, res) => {
//     try {
//       const { workerId, jobId, projectId, totalDays, paymentPerDay } = req.body;
//       const totalAmount = totalDays * paymentPerDay;

//       const newPayroll = new Payroll({
//         workerId,
//         jobId,
//         projectId,
//         totalDays,
//         paymentPerDay,
//         totalAmount,
//         status: 'Pending',
//       });

//       await newPayroll.save();
//       res.status(201).json(newPayroll);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// };

// export default payrollController;






import Payroll from '../models/payroll.js';

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
