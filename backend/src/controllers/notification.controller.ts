import { Request, Response } from 'express';
import { Notification } from '../models/notification.model';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const whereClause = userId ? { userId: userId as string } : {};
        const notifications = await Notification.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications', error });
    }
};

export const createNotification = async (req: Request, res: Response) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: 'Error creating notification', error });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const [updated] = await Notification.update(
            { isRead: true, readAt: new Date() },
            { where: { id: req.params.id } }
        );
        if (updated) {
            const updatedNotification = await Notification.findByPk(req.params.id);
            res.json(updatedNotification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error });
    }
};
