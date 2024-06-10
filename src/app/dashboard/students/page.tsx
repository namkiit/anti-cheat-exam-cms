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
import { StudentsFilters } from '@/components/dashboard/students/students-filters';
import { StudentsTable } from '@/components/dashboard/students/students-table';
import type { Student } from '@/components/dashboard/students/students-table';

export const metadata = { title: `Students | Dashboard | ${config.site.name}` } satisfies Metadata;

const students = [
  {
    id: "20198235",
    fname: "Kiet",
    lname: "Nguyen",
    password: "namkiet3010",
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Student[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedStudents = applyPagination(students, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Students</Typography>
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
