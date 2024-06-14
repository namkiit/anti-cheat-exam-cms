import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import { config } from '@/config';
import { StudentsFilters } from '@/components/dashboard/students/students-filters';
import { StudentsTable } from '@/components/dashboard/students/students-table';
import type { Student } from '@/components/dashboard/students/students-table';
import { TopControl } from '@/components/top-control/top-control';
import { getAllStudents } from '@/services/api/student-api';

export const metadata = { title: `Students | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
  const students: Student[] = await getAllStudents()

  const page = 0;
  const rowsPerPage = 5;

  const paginatedStudents = applyPagination(students, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <TopControl title="Students" />
      <StudentsFilters />
      <StudentsTable
        count={paginatedStudents.length}
        page={page}
        rows={paginatedStudents}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Student[], page: number, rowsPerPage: number): Student[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
