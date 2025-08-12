
import express from 'express';
import payrollController from '../controllers/payrollController.js';
import {getFullPaymentHistoryByEmail} from '../controllers/payrollController.js';

const router = express.Router();

router.get('/project/:projectId', payrollController.getPayrollsByProject);
router.get('/worker/:workerId', payrollController.getPayrollByWorker);
router.post('/', payrollController.createPayroll);
router.get("/full-payment-history",getFullPaymentHistoryByEmail )

export default router;
