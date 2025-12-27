
export type EventStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export type UserRole = 'Admin' | 'Coordinator' | 'Viewer';

export interface Department {
  id: string;
  name: string;
  code: string;
  coordinatorName: string;
  totalCredits: number;
  eventCount: number;
}

export interface Event {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  date: string;
  type: 'Awareness' | 'Implementation' | 'Innovation' | 'Research' | 'Other';
  description: string;
  participants: number;
  sdgs: string[];
  status: EventStatus;
  credits: number;
  imageUrl?: string;
  submissionDate: string;
  feedback?: string;
  actionsTaken?: string;
  proofLink?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  departmentId?: string; // Only for coordinators
}

export const SDG_LIST = [
  "1. No Poverty", "2. Zero Hunger", "3. Good Health & Well-being", "4. Quality Education",
  "5. Gender Equality", "6. Clean Water & Sanitation", "7. Affordable & Clean Energy",
  "8. Decent Work & Economic Growth", "9. Industry, Innovation & Infrastructure",
  "10. Reduced Inequalities", "11. Sustainable Cities & Communities",
  "12. Responsible Consumption & Production", "13. Climate Action",
  "14. Life Below Water", "15. Life on Land", "16. Peace, Justice & Strong Institutions",
  "17. Partnerships for the Goals"
];