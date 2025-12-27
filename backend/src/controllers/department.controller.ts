import { Request, Response } from 'express';
import * as departmentService from '../services/department.service';

export const getDepartments = async (req: any, res: any) => {
  try {
    const depts = await departmentService.getAllDepartments();
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error });
  }
};

export const createDepartment = async (req: any, res: any) => {
  try {
    const dept = await departmentService.createDepartment(req.body);
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: 'Error creating department', error });
  }
};

export const deleteDepartment = async (req: any, res: any) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error });
  }
};