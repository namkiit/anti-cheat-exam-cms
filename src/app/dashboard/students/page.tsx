import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { StudentsTable } from '@/components/dashboard/students/students-table';

export const metadata = { title: `Students | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <StudentsTable />
  );
}
