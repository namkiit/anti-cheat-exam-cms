import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'exams', title: 'Exams', href: paths.dashboard.exams, icon: 'exam' },
  { key: 'students', title: 'Students', href: paths.dashboard.students, icon: 'student' },
] satisfies NavItemConfig[];