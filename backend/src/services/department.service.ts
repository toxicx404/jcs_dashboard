import { Department } from '../models/department.model';
import { Event } from '../models/event.model';
import { sequelize } from '../config/db';

export const getAllDepartments = async () => {
  // Fetch all departments
  const departments = await Department.findAll();
  
  // Recalculate stats for each department to ensure accuracy
  for (const dept of departments) {
    const approvedEvents = await Event.findAll({
      where: {
        departmentId: dept.id,
        status: 'Approved'
      }
    });
    
    const allEvents = await Event.findAll({
      where: {
        departmentId: dept.id
      }
    });
    
    const totalCredits = approvedEvents.reduce((sum, e) => sum + (e.credits || 0), 0);
    const eventCount = allEvents.length;
    
    // Update if stats have changed
    if (dept.totalCredits !== totalCredits || dept.eventCount !== eventCount) {
      await dept.update({ totalCredits, eventCount });
    }
  }
  
  // Return updated departments
  return await Department.findAll({
    order: [['totalCredits', 'DESC']]
  });
};

export const createDepartment = async (data: any) => {
  return await Department.create(data);
};

export const deleteDepartment = async (id: string) => {
  const dept = await Department.findByPk(id);
  if (dept) {
    await dept.destroy();
    return true;
  }
  return false;
};