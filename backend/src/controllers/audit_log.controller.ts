import { Request, Response } from 'express';
import { AuditLog } from '../models/audit_log.model';

export const getLogs = async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']] });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving logs', error });
    }
};

export const createLog = async (req: Request, res: Response) => {
    try {
        const log = await AuditLog.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: 'Error creating log', error });
    }
};
