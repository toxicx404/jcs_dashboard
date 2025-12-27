import { Request, Response } from 'express';
import * as eventService from '../services/event.service';

export const getEvents = async (req: any, res: any) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const createEvent = async (req: any, res: any) => {
  try {
    const eventData = {
      ...req.body,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    const event = await eventService.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const updateEvent = async (req: any, res: any) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const bulkUpdateEvents = async (req: any, res: any) => {
  try {
    const result = await eventService.bulkUpdateEvents(req.body);
    res.json({ success: true, count: result.length });
  } catch (error) {
    res.status(500).json({ message: 'Error bulk updating events', error });
  }
};

export const deleteEvent = async (req: any, res: any) => {
  try {
    const success = await eventService.deleteEvent(req.params.id);
    if (!success) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};