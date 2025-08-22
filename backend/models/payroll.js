import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'job', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project', required: true },

  month: { type: String }, // e.g. "2025-08"
  paymentDates: [String],  // e.g. ["2025-08-02", "2025-08-15"]
  paidAmounts: [Number],   // e.g. [2000, 1500]
  totalSalary: { type: Number, required: true },
  balance: { type: Number, required: true },

  present: Number,
  absent: Number,

  status: { type: String, enum: ['Paid', 'Partial', 'Unpaid'], default: 'Unpaid' },
}, { timestamps: true });

export default mongoose.model('payroll', payrollSchema);