import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/user.controller';

import { authMiddleware, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // All user routes require login

router.get('/', authorize(['Admin', 'Coordinator']), getAllUsers);
router.get('/:id', authorize(['Admin', 'Coordinator']), getUserById);
router.post('/', authorize(['Admin']), createUser);
router.put('/:id', authorize(['Admin']), updateUser);
router.delete('/:id', authorize(['Admin']), deleteUser);

export default router;
