import express from 'express';
import { createPartnership, getAllPartnerships, updatePartnershipStatus, deletePartnership } from '../controllers/partnership.controller';

import { authMiddleware, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Public route to create a partnership request
router.post('/', createPartnership);

// Protected routes (Admin only)
router.use(authMiddleware);
router.get('/', authorize(['Admin']), getAllPartnerships);
router.put('/:id/status', authorize(['Admin']), updatePartnershipStatus);
router.delete('/:id', authorize(['Admin']), deletePartnership);

export default router;
