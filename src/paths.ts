export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    // overview: '/dashboard',
    exams: '/dashboard/exams',
    students: '/dashboard/students',
    questions: '/dashboard/questions',
    settings: '/dashboard/settings',
    account: '/dashboard/account'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
