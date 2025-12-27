import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['passwordHash'] } // Don't send passwords back
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['passwordHash'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, departmentId } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Auto-generate username from email
        // Example: john.doe@example.com -> john.doe
        let username = email.split('@')[0];
        // Ensure uniqueness by appending 4 random digits if needed (simple collision avoidance)
        // For now, let's try just the prefix, and if it fails, we handle it?
        // Better: just generate unique username with random suffix
        username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;

        const user = await User.create({
            username, // Added generated username
            name,
            email,
            passwordHash: hashedPassword,
            role: role || 'Viewer',
            departmentId: departmentId || null
        } as any);

        const userResponse = user.toJSON();
        delete (userResponse as any).passwordHash;

        res.status(201).json(userResponse);
    } catch (error: any) {
        console.error("Error creating user:", error); // Log full error
        res.status(400).json({
            message: 'Error creating user',
            error: error.message || error
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role, departmentId, password } = req.body;
        const updates: any = {};

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (departmentId !== undefined) updates.departmentId = departmentId;
        if (password) {
            updates.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const [updated] = await User.update(updates, {
            where: { id: req.params.id },
        });

        if (updated) {
            const updatedUser = await User.findByPk(req.params.id, {
                attributes: { exclude: ['passwordHash'] }
            });
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
