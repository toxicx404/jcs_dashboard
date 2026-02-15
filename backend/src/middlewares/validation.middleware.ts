import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ];
};

export const registerValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required').trim().escape(),
        body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['Admin', 'Coordinator', 'User', 'Viewer']),
        body('departmentId').optional().isInt()
    ];
};

export const changePasswordValidationRules = () => {
    return [
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    ];
};
