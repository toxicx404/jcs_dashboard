import { Request, Response } from 'express';
import { FileUpload } from '../models/file_upload.model';

export const getAllFiles = async (req: Request, res: Response) => {
    try {
        const files = await FileUpload.findAll();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving files', error });
    }
};

export const getFileById = async (req: Request, res: Response) => {
    try {
        const file = await FileUpload.findByPk(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving file', error });
    }
};

export const createFileRecord = async (req: Request, res: Response) => {
    try {
        // If used with multer, some data might be in req.file, but here we assume body has the metadata
        // or we can construct it if we want to be smart. For now, strict CRUD on the table.
        const file = await FileUpload.create(req.body);
        res.status(201).json(file);
    } catch (error) {
        res.status(400).json({ message: 'Error creating file record', error });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const deleted = await FileUpload.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error });
    }
};
