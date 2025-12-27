import { Router } from 'express';
import {
    getSettings,
    getSettingByKey,
    updateSetting,
} from '../controllers/setting.controller';

const router = Router();

router.get('/', getSettings);
router.get('/:key', getSettingByKey);
router.put('/:key', updateSetting);

export default router;
