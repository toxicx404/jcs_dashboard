import { Request, Response } from 'express';
import { Setting } from '../models/setting.model';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await Setting.findAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving settings', error });
    }
};

export const getSettingByKey = async (req: Request, res: Response) => {
    try {
        const setting = await Setting.findOne({ where: { keyName: req.params.key } });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving setting', error });
    }
};

export const updateSetting = async (req: Request, res: Response) => {
    try {
        const [updated] = await Setting.update(req.body, {
            where: { keyName: req.params.key },
        });
        if (updated) {
            const updatedSetting = await Setting.findOne({ where: { keyName: req.params.key } });
            res.json(updatedSetting);
        } else {
            // Try creating if it doesn't exist?
            // For now, strict update.
            res.status(404).json({ message: 'Setting not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating setting', error });
    }
};
