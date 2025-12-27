import { Event } from '../models/event.model';
import { Department } from '../models/department.model';
import { sequelize } from '../config/db';

export const getAllEvents = async () => {
  return await Event.findAll({
    order: [['createdAt', 'DESC']]
  });
};

export const createEvent = async (data: any) => {
  // Use a transaction to ensure event creation and dept count increment happen together
  const t = await sequelize.transaction();

  try {
    const newEvent = await Event.create(data, { transaction: t });

    if (newEvent.departmentId) {
      await Department.update(
        { eventCount: sequelize.literal('eventCount + 1') },
        {
          where: { id: newEvent.departmentId },
          transaction: t
        }
      );
    }

    await t.commit();
    return newEvent;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateEvent = async (id: string, data: any) => {
  const event = await Event.findByPk(id);
  if (!event) return null;

  await event.update(data);

  // Recalculate department credits if status is Approved
  // In production, this might be better as a separate job or simplified trigger
  if (event.departmentId) {
    const deptEvents = await Event.findAll({
      where: {
        departmentId: event.departmentId,
        status: 'Approved'
      }
    });

    const totalCredits = deptEvents.reduce((sum, e) => sum + (e.credits || 0), 0);

    await Department.update(
      { totalCredits },
      { where: { id: event.departmentId } }
    );
  }

  return event;
};

export const bulkUpdateEvents = async (updates: any[]) => {
  const results = [];
  for (const update of updates) {
    if (update.id) {
      // Re-using the update logic to ensure credit recalculation
      results.push(await updateEvent(update.id, update));
    }
  }
  return results;
};

export const deleteEvent = async (id: string) => {
  const t = await sequelize.transaction();
  try {
    const event = await Event.findByPk(id, { transaction: t });
    if (!event) {
      await t.rollback();
      return false;
    }

    if (event.departmentId) {
      // Decrement event count
      await Department.update(
        { eventCount: sequelize.literal('eventCount - 1') },
        { where: { id: event.departmentId }, transaction: t }
      );

      if (event.status === 'Approved') {
        // We rely on separate recalc or accept simplified update for now
      }
    }

    await event.destroy({ transaction: t });
    await t.commit();

    // Trigger credit recalc derived from remaining events
    if (event.departmentId) {
      const deptEvents = await Event.findAll({ where: { departmentId: event.departmentId, status: 'Approved' } });
      const totalCredits = deptEvents.reduce((sum, e) => sum + (e.credits || 0), 0);
      await Department.update({ totalCredits }, { where: { id: event.departmentId } });
    }

    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};