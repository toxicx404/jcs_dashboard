import { Router } from 'express';
import * as eventController from '../controllers/event.controller';

import { authMiddleware, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', eventController.getEvents);
router.post('/', authorize(['Admin', 'Coordinator']), eventController.createEvent);
router.put('/:id', authorize(['Admin', 'Coordinator']), eventController.updateEvent);
router.post('/bulk-update', authorize(['Admin', 'Coordinator']), eventController.bulkUpdateEvents);
router.delete('/:id', authorize(['Admin']), eventController.deleteEvent);

export default router;