import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import { config } from '@/config';
import { ExamsFilters } from '@/components/dashboard/exams/exams-filters';
import { ExamsTable } from '@/components/dashboard/exams/exams-table';
import type { Exam } from '@/components/dashboard/exams/exams-table';
import { TopControl } from '@/components/top-control/top-control';
import { getAllExams } from '@/services/api/exam-api';

export const metadata = { title: `Exams | Dashboard | ${config.site.name}` } satisfies Metadata;


export default async function Page(): Promise<React.JSX.Element> {
  const exams: Exam[] = await getAllExams();

  const page = 0;
  const rowsPerPage = 5;
  const paginatedExams = applyPagination(exams, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <TopControl title="Exams" />
      <ExamsFilters />
      <ExamsTable
        count={paginatedExams.length}
        page={page}
        rows={paginatedExams}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Exam[], page: number, rowsPerPage: number): Exam[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
