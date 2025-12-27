import { Router } from 'express';
import { getLogs, createLog } from '../controllers/audit_log.controller';

const router = Router();

router.get('/', getLogs);
router.post('/', createLog);

export default router;
