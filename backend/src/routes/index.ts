import { Router, Request, Response } from 'express';
import departmentRoutes from './department.routes';
import partnershipRoutes from './partnership.routes';
import eventRoutes from './event.routes';
import userRoutes from './user.routes';
import fileUploadRoutes from './file_upload.routes';
import auditLogRoutes from './audit_log.routes';
import notificationRoutes from './notification.routes';
import eventCommentRoutes from './event_comment.routes';
import settingRoutes from './setting.routes';
import authRoutes from './auth.routes';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Domain Routes
router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/partnerships', partnershipRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/files', fileUploadRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/notifications', notificationRoutes);
router.use('/comments', eventCommentRoutes);
router.use('/settings', settingRoutes);

// File Upload Route
router.post('/upload', upload.single('file') as any, (req: any, res: any): any => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

export default router;