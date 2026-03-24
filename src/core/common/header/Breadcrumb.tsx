import { Link, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from '../../redux/store';
import { ROLE_CONFIG } from '../../redux/roleSlice';
import { all_routes } from '../../../feature-module/routes/all_routes';

// Build a reverse map from path → label
const ROUTE_LABELS: Record<string, string> = {};
const entries = Object.entries(all_routes);
for (const [key, path] of entries) {
  // Convert camelCase key to readable label
  const label = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/settings$/i, 'Settings')
    .trim();
  ROUTE_LABELS[path] = label;
}

// Manual overrides for cleaner labels
const LABEL_OVERRIDES: Record<string, string> = {
  [all_routes.dashboard]: 'Admin Dashboard',
  [all_routes.doctordashboard]: 'Doctor Dashboard',
  [all_routes.patientdashboard]: 'Patient Dashboard',
  [all_routes.chat]: 'Chat',
  [all_routes.calendar]: 'Calendar',
  [all_routes.notes]: 'Notes',
  [all_routes.email]: 'Email',
  [all_routes.todo]: 'Todo',
  [all_routes.todoList]: 'Todo List',
  [all_routes.voiceCall]: 'Voice Call',
  [all_routes.videoCall]: 'Video Call',
  [all_routes.fileManager]: 'File Manager',
  [all_routes.kanbanView]: 'Kanban View',
  [all_routes.invoice]: 'Invoice',
  [all_routes.contacts]: 'Contacts',
  [all_routes.shiftHandoff]: 'Shift Handoff',
  [all_routes.doctors]: 'Doctors',
  [all_routes.patients]: 'Patients',
  [all_routes.appointments]: 'Appointments',
  [all_routes.staffs]: 'Staffs',
  [all_routes.payroll]: 'Payroll',
  [all_routes.expenses]: 'Expenses',
  [all_routes.invoices]: 'Invoices',
  [all_routes.profilesettings]: 'Profile Settings',
};

// Section grouping: map path prefixes to section labels + links
const SECTION_MAP: { prefix: string; label: string; link?: string }[] = [
  { prefix: '/application/', label: 'Applications' },
  { prefix: '/doctor/', label: 'Doctor' },
  { prefix: '/patient/', label: 'Patient' },
  { prefix: '/super-admin/', label: 'Super Admin' },
  { prefix: '/ai/', label: 'AI Features' },
];

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb = () => {
  return null;
};

export default Breadcrumb;
