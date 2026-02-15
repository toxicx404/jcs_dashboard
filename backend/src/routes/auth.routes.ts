import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

import { authLimiter } from '../middlewares/rateLimiter';
import { validate, loginValidationRules, changePasswordValidationRules } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', authLimiter, loginValidationRules(), validate, authController.login);
router.put('/change-password', authMiddleware, changePasswordValidationRules(), validate, authController.changePassword);

export default router;
