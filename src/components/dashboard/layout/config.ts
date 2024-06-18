import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'exams', title: 'Exams', href: paths.dashboard.exams, icon: 'exam' },
  { key: 'questions', title: 'Questions', href: paths.dashboard.questions, icon: 'question' },
  { key: 'students', title: 'Students', href: paths.dashboard.students, icon: 'student' },
] satisfies NavItemConfig[];
