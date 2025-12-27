import { Department, Event, User } from '../types';

const API_URL = 'http://localhost:5000/api';

/**
 * 🌐 API SERVICE LAYER
 * Connects to the Node.js/Express backend
 */

export const api = {

  // --- AUTH ---


  async login(credentials: { email: string; password: string }): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Login failed');
    }

    return response.json();
  },


  // --- FILE STORAGE ---

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.url;
  },

  // --- PARTNERSHIPS (CRUD) ---

  async createPartnership(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/partnerships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create partnership');
    return response.json();
  },

  async getPartnerships(): Promise<any[]> {
    const response = await fetch(`${API_URL}/partnerships`);
    if (!response.ok) throw new Error('Failed to fetch partnerships');
    return response.json();
  },

  async updatePartnershipStatus(id: string, status: string): Promise<any> {
    const response = await fetch(`${API_URL}/partnerships/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update partnership status');
    return response.json();
  },

  async deletePartnership(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/partnerships/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete partnership');
  },

  // --- DEPARTMENTS (CRUD) ---

  async getDepartments(): Promise<Department[]> {
    try {
      const response = await fetch(`${API_URL}/departments`);
      if (!response.ok) {
        console.warn('Failed to fetch departments, using empty array');
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  async addDepartment(deptData: Omit<Department, 'id' | 'totalCredits' | 'eventCount'>): Promise<Department> {
    const response = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deptData),
    });
    if (!response.ok) throw new Error('Failed to add department');
    return response.json();
  },

  async removeDepartment(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/departments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove department');
  },

  // --- USERS (CRUD & Profile) ---

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) return [];
    return response.json();
  },

  async createUser(userData: any): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(userId: string, updates: any): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  async changePassword(data: { userId: string, newPassword: string }): Promise<void> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to change password');
    }
  },

  // --- EVENTS (CRUD) ---

  async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        console.warn('Failed to fetch events, using empty array');
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async createEvent(eventData: Omit<Event, 'id' | 'submissionDate' | 'status' | 'credits'>): Promise<Event> {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  async updateEvent(updatedEvent: Event): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  async bulkUpdateEvents(updates: Event[]): Promise<void> {
    const response = await fetch(`${API_URL}/events/bulk-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to bulk update events');
  },

  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  }
};