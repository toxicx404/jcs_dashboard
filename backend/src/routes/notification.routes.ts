import { Router } from 'express';
import {
    getNotifications,
    createNotification,
    markAsRead,
} from '../controllers/notification.controller';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);

export default router;
