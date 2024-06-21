import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Layout } from '@/components/auth/layout';
import { SignInForm } from '@/components/auth/sign-in-form';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard/exams');
  }

  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}
