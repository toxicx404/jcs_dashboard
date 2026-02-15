import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';

import { authMiddleware, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', departmentController.getDepartments);
router.post('/', authorize(['Admin']), departmentController.createDepartment);
router.delete('/:id', authorize(['Admin']), departmentController.deleteDepartment);

export default router;