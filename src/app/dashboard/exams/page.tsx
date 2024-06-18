import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { ExamsTable } from '@/components/dashboard/exams/exams-table';

export const metadata = { title: `Exams | Dashboard | ${config.site.name}` } satisfies Metadata;


export default async function Page(): Promise<React.JSX.Element> {
  return (
      <ExamsTable />
  );
}
