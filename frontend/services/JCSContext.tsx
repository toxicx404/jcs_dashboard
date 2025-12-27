import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { MOCK_USERS } from '../mockData';
import { EventStatus, Event, Department, User } from '../types';
import { api } from './api';

// Defined Context Type for better intellisense
// ... (imports)

// Defined Context Type for better intellisense
interface JCSContextType {
  departments: Department[];
  events: Event[];
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  addEvent: (eventData: any) => Promise<void>;
  updateEventStatus: (eventId: string, status?: EventStatus, credits?: number, feedback?: string) => Promise<void>;
  bulkUpdateEventStatus: (eventIds: string[], status: EventStatus, credits?: number, feedback?: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addDepartment: (deptData: any) => Promise<void>;
  removeDepartment: (id: string) => Promise<void>;
  addUser: (userData: any) => Promise<void>;
  updateUser: (userId: string, updates: any) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  changeUserPassword: (data: any) => Promise<void>;
  getDepartmentEvents: (deptId: string) => Event[];
  getPendingEvents: () => Event[];
  darkMode: boolean;
  toggleDarkMode: (event: any) => void;
  resetData: () => void;
}

const JCSContext = createContext<JCSContextType | undefined>(undefined);

export const JCSProvider = ({ children }: PropsWithChildren<{}>) => {
  console.log('🔧 JCSProvider initializing...');

  // Global State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Auth State - Persisted in SessionStorage (Independent per tab, survives refresh)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('jcs-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  console.log('📊 Initial state:', { departments: departments.length, events: events.length, currentUser, isLoading });

  // Dark Mode (UI State - kept in local storage for preference across tabs)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('jcs-theme');
    return saved === 'dark';
  });

  // --- 1. INITIAL DATA FETCHING ---
  const refreshData = async () => {
    console.log('🔄 Starting data fetch...');
    try {
      // Fetch resources in parallel
      console.log('📡 Fetching departments, events, and users...');
      const [fetchedDepartments, fetchedEvents, fetchedUsers] = await Promise.all([
        api.getDepartments(),
        api.getEvents(),
        api.getUsers()
      ]);

      console.log('✅ Data fetched:', {
        departments: fetchedDepartments?.length || 0,
        events: fetchedEvents?.length || 0,
        users: fetchedUsers?.length || 0
      });

      setDepartments(fetchedDepartments || []);
      setEvents(fetchedEvents || []);
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("❌ Failed to fetch data from API:", error);
      // Set empty arrays on error to prevent white screen
      setDepartments([]);
      setEvents([]);
      setUsers([]);
    } finally {
      console.log('🏁 Data fetch complete, setting isLoading to false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // ... (Theme Effect omitted for brevity in diff, assume it exists)

  // --- 2. THEME EFFECT ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('jcs-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('jcs-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = (event: any) => {
    if (!(document as any).startViewTransition) {
      setDarkMode(!darkMode);
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const isTurningDark = !darkMode;

    const transition = (document as any).startViewTransition(() => {
      setDarkMode(isTurningDark);
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        { clipPath: isTurningDark ? clipPath : [...clipPath].reverse() },
        { duration: 500, easing: "ease-in-out", pseudoElement: isTurningDark ? "::view-transition-new(root)" : "::view-transition-old(root)" }
      );
    });
  };

  // --- 3. DERIVED STATE CALCULATION ---
  useEffect(() => {
    if (events.length === 0 && departments.length === 0) return;

    const updatedDepartments = departments.map(dept => {
      const deptEvents = events.filter(e => e.departmentId === dept.id && e.status === 'Approved');
      const totalCredits = deptEvents.reduce((sum, e) => sum + (e.credits || 0), 0);
      const eventCount = events.filter(e => e.departmentId === dept.id).length;
      return { ...dept, totalCredits, eventCount };
    });

    // Deep check to avoid infinite loops
    if (JSON.stringify(updatedDepartments) !== JSON.stringify(departments)) {
      setDepartments(updatedDepartments);
    }
  }, [events, departments.length]);

  // --- 4. ACTIONS (Calling API) ---

  const login = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('jcs-user', JSON.stringify(user));
    // Refresh data on login to ensure we have latest permissions/data
    if (!users.length) refreshData();
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('jcs-user');
  };

  const addEvent = async (eventPayload: any) => {
    const dept = departments.find(d => d.id === eventPayload.departmentId);
    const createdEvent = await api.createEvent({
      ...eventPayload,
      departmentName: dept ? dept.name : 'Unknown Dept',
      imageUrl: eventPayload.imageUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`
    });
    setEvents(prev => [createdEvent, ...prev]);
  };

  const updateEventStatus = async (eventId: string, status?: EventStatus, credits = 0, feedback = '') => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (!eventToUpdate) return;

    const updatedEvent: Event = {
      ...eventToUpdate,
      status: status || eventToUpdate.status,
      credits: credits !== undefined ? credits : eventToUpdate.credits,
      feedback: feedback || eventToUpdate.feedback
    };

    await api.updateEvent(updatedEvent);
    setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
  };

  const bulkUpdateEventStatus = async (eventIds: string[], status: EventStatus, credits = 0, feedback = '') => {
    const updates: Event[] = [];
    const updatedEventsList = events.map(e => {
      if (eventIds.includes(e.id)) {
        const updated = {
          ...e,
          status,
          credits: credits !== undefined ? credits : e.credits,
          feedback: feedback || e.feedback
        };
        updates.push(updated);
        return updated;
      }
      return e;
    });

    await api.bulkUpdateEvents(updates);
    setEvents(updatedEventsList);
  };

  const deleteEvent = async (eventId: string) => {
    await api.deleteEvent(eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const addDepartment = async (deptData: any) => {
    const newDept = await api.addDepartment(deptData);
    setDepartments(prev => [...prev, newDept]);
  };

  const removeDepartment = async (id: string) => {
    await api.removeDepartment(id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // User Actions
  const addUser = async (userData: any) => {
    const newUser = await api.createUser(userData);
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (userId: string, updates: any) => {
    const updatedUser = await api.updateUser(userId, updates);
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));

    // If updating current user, update session too
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updatedUser });
    }
  };

  const removeUser = async (userId: string) => {
    await api.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const changeUserPassword = async (data: any) => {
    await api.changePassword(data);
  };

  const getDepartmentEvents = (deptId: string) => {
    return events.filter(e => e.departmentId === deptId);
  };

  const getPendingEvents = () => {
    return events.filter(e => e.status === 'Submitted' || e.status === 'Under Review');
  };

  const resetData = () => {
    localStorage.removeItem('jcs-events');
    localStorage.removeItem('jcs-departments');
    window.location.reload();
  };

  return (
    <JCSContext.Provider value={{
      departments,
      events,
      users,
      currentUser,
      isLoading,
      login,
      logout,
      addEvent,
      updateEventStatus,
      bulkUpdateEventStatus,
      getDepartmentEvents,
      getPendingEvents,
      addDepartment,
      removeDepartment,
      addUser,
      updateUser,
      removeUser,
      changeUserPassword,
      deleteEvent,
      darkMode,
      toggleDarkMode,
      resetData
    }}>
      {children}
    </JCSContext.Provider>
  );
};

export const useJCS = () => {
  const context = useContext(JCSContext);
  if (!context) {
    throw new Error('useJCS must be used within a JCSProvider');
  }
  return context;
};