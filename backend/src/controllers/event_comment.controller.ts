import { Request, Response } from 'express';
import { EventComment } from '../models/event_comment.model';

export const getCommentsByEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const comments = await EventComment.findAll({
            where: { eventId },
            order: [['createdAt', 'ASC']],
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const comment = await EventComment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Error adding comment', error });
    }
};
