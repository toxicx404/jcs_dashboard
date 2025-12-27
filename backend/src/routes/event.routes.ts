import { Router } from 'express';
import * as eventController from '../controllers/event.controller';

const router = Router();

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.post('/bulk-update', eventController.bulkUpdateEvents);
router.delete('/:id', eventController.deleteEvent);

export default router;