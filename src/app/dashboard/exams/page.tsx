import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { ExamsFilters } from '@/components/dashboard/exams/exams-filters';
import { ExamsTable } from '@/components/dashboard/exams/exams-table';
import type { Exam } from '@/components/dashboard/exams/exams-table';

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
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Exams</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
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
