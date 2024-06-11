import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { config } from '@/config';
import { ExamsFilters } from '@/components/dashboard/exams/exams-filters';
import { ExamsTable } from '@/components/dashboard/exams/exams-table';
import type { Exam } from '@/components/dashboard/exams/exams-table';
import { TopControl } from '@/components/top-control/top-control';

export const metadata = { title: `Exams | Dashboard | ${config.site.name}` } satisfies Metadata;

const exams = [
  {
    id: '220001',
    name: 'Cấu trúc dữ liệu & giải thuật',
    questionCount: 5,
    duration: 3600,
    status: "pending",
    startDate: "2024-05-20T10:30:00.000+07:00",
    endDate: "2024-05-20T11:30:00.000+07:00",
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: '220002',
    name: 'Giải tích 3',
    questionCount: 5,
    duration: 3600,
    status: "pending",
    startDate: "2024-05-20T10:30:00.000+07:00",
    endDate: "2024-05-20T11:30:00.000+07:00",
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: '220003',
    name: 'Web programming',
    questionCount: 5,
    duration: 3600,
    status: "pending",
    startDate: "2024-05-20T10:30:00.000+07:00",
    endDate: "2024-05-20T11:30:00.000+07:00",
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Exam[];

export default function Page(): React.JSX.Element {
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
