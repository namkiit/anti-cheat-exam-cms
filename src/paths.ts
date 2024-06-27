export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in' },
  dashboard: {
    exams: '/dashboard/exams',
    questions: '/dashboard/questions',
    students: '/dashboard/students',
    settings: '/dashboard/settings',
    account: '/dashboard/account'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
