import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';

const router = Router();

router.get('/', departmentController.getDepartments);
router.post('/', departmentController.createDepartment);
router.delete('/:id', departmentController.deleteDepartment);

export default router;