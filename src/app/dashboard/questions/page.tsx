import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { QuestionsTable } from '@/components/dashboard/questions/questions-table';

export const metadata = { title: `Questions | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <QuestionsTable />
  );
}
