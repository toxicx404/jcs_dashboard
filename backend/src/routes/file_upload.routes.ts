import { Router } from 'express';
import {
    getAllFiles,
    getFileById,
    createFileRecord,
    deleteFile,
} from '../controllers/file_upload.controller';

const router = Router();

router.get('/', getAllFiles);
router.get('/:id', getFileById);
router.post('/record', createFileRecord);
router.delete('/:id', deleteFile);

export default router;
