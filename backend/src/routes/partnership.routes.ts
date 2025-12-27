import express from 'express';
import { createPartnership, getAllPartnerships, updatePartnershipStatus, deletePartnership } from '../controllers/partnership.controller';

const router = express.Router();

// Public route to create a partnership request
router.post('/', createPartnership);

// Protected route (add auth middleware later if needed) specific for admin
router.get('/', getAllPartnerships);
router.put('/:id/status', updatePartnershipStatus);
router.delete('/:id', deletePartnership);

export default router;
