
import { Department, Event, User } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'School of Sciences', code: 'SOS', coordinatorName: 'Dr. Alan Grant', totalCredits: 120, eventCount: 5 },
  { id: 'd2', name: 'School of Engineering', code: 'SOE', coordinatorName: 'Prof. Sarah Smith', totalCredits: 85, eventCount: 3 },
  { id: 'd3', name: 'School of Law', code: 'SOL', coordinatorName: 'Dr. Emily Chen', totalCredits: 100, eventCount: 4 },
  { id: 'd4', name: 'School of Design', code: 'SOD', coordinatorName: 'Mr. John Doe', totalCredits: 45, eventCount: 2 },
  { id: 'd5', name: 'Jaipur School of Business', code: 'JSB', coordinatorName: 'Ms. Lisa Ray', totalCredits: 60, eventCount: 3 },
  { id: 'd6', name: 'Jaipur School of Economics', code: 'JSE', coordinatorName: 'Dr. Robert Brown', totalCredits: 30, eventCount: 1 },
  { id: 'd7', name: 'School of Humanities & Social Sciences', code: 'SHSS', coordinatorName: 'Prof. Alice Green', totalCredits: 50, eventCount: 2 },
  { id: 'd8', name: 'School of Computer Applications', code: 'SCA', coordinatorName: 'Mr. David White', totalCredits: 75, eventCount: 4 },
  { id: 'd9', name: 'School of Mass Communication', code: 'SMC', coordinatorName: 'Ms. Karen Black', totalCredits: 40, eventCount: 2 },
  { id: 'd10', name: 'School of Allied Health Sciences', code: 'SAHS', coordinatorName: 'Dr. James Blue', totalCredits: 90, eventCount: 3 },
  { id: 'd11', name: 'School of Bio-Informatics', code: 'SBI', coordinatorName: 'Prof. Mary Rose', totalCredits: 20, eventCount: 1 },
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Tree Plantation Drive',
    departmentId: 'd1',
    departmentName: 'School of Sciences',
    fromDate: '2023-10-15',
    toDate: '2023-10-15',
    type: 'Implementation',
    description: 'Planted 50 saplings around the campus boundary.',
    participants: 120,
    sdgs: ['13. Climate Action', '15. Life on Land'],
    status: 'Approved',
    credits: 20,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    submissionDate: '2023-10-16'
  },
  {
    id: 'e2',
    title: 'Solar Energy Workshop',
    departmentId: 'd2',
    departmentName: 'School of Engineering',
    fromDate: '2023-11-05',
    toDate: '2023-11-07',
    type: 'Awareness',
    description: 'Workshop on benefits of solar panels for students.',
    participants: 200,
    sdgs: ['7. Affordable & Clean Energy'],
    status: 'Approved',
    credits: 15,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    submissionDate: '2023-11-06'
  },
  {
    id: 'e3',
    title: 'Waste Management System',
    departmentId: 'd2',
    departmentName: 'School of Engineering',
    fromDate: '2023-12-01',
    toDate: '2023-12-01',
    type: 'Innovation',
    description: 'Designed a new prototype for automated waste segregation.',
    participants: 15,
    sdgs: ['12. Responsible Consumption & Production', '9. Industry, Innovation & Infrastructure'],
    status: 'Under Review',
    credits: 0,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    submissionDate: '2023-12-02'
  },
  {
    id: 'e4',
    title: 'Legal Aid Camp',
    departmentId: 'd3',
    departmentName: 'School of Law',
    fromDate: '2024-01-20',
    toDate: '2024-01-22',
    type: 'Awareness',
    description: 'Provided free legal advice to nearby village residents.',
    participants: 300,
    sdgs: ['16. Peace, Justice & Strong Institutions', '10. Reduced Inequalities'],
    status: 'Submitted',
    credits: 0,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    submissionDate: '2024-01-21'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', role: 'Admin' },
  { id: 'u2', name: 'Organizer', role: 'Coordinator', departmentId: 'd1' },
  { id: 'u3', name: 'Student Viewer', role: 'Viewer' },
];