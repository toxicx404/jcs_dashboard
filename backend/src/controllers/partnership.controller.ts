import { Request, Response } from 'express';
import { Partnership } from '../models/partnership.model';

export const createPartnership = async (req: Request, res: Response) => {
    try {
        const partnership = await Partnership.create(req.body);
        res.status(201).json(partnership);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllPartnerships = async (req: Request, res: Response) => {
    try {
        const partnerships = await Partnership.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(partnerships);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePartnershipStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' | 'Rejected'

        const partnership = await Partnership.findByPk(id);
        if (!partnership) {
            return res.status(404).json({ message: 'Partnership request not found' });
        }

        partnership.status = status;
        await partnership.save();

        res.status(200).json(partnership);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePartnership = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const partnership = await Partnership.findByPk(id);

        if (!partnership) {
            return res.status(404).json({ message: 'Partnership request not found' });
        }

        await partnership.destroy();
        res.status(200).json({ message: 'Partnership request deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
