import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

import { config } from '@/config';
import { StudentsFilters } from '@/components/dashboard/students/students-filters';
import { StudentsTable } from '@/components/dashboard/students/students-table';
import type { Student } from '@/components/dashboard/students/students-table';
import { TopControl } from '@/components/top-control/top-control';

export const metadata = { title: `Students | Dashboard | ${config.site.name}` } satisfies Metadata;

const students = [
  {
    id: "20198235",
    fname: "Kiet",
    lname: "Nguyen",
    password: "namkiet3010",
    assignedExams: [ "220001", "220002", "220003" ],
    submittedExams: [],
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Student[];

export default function Page(): React.JSX.Element {
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
