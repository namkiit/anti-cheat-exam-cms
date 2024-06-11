import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { config } from '@/config';
import { QuestionsFilters } from '@/components/dashboard/questions/questions-filters';
import { QuestionsTable } from '@/components/dashboard/questions/questions-table';
import type { Question } from '@/components/dashboard/questions/questions-table';
import { TopControl } from '@/components/top-control/top-control';

export const metadata = { title: `Questions | Dashboard | ${config.site.name}` } satisfies Metadata;

const questions = [
  {
    id: "20198235",
    title: "Trong cấu trúc dữ liệu, \"Queue\" (hàng đợi) được mô tả như thế nào?",
    answers: [
      { label: "a", text: "Dãy số nguyên liên tiếp" },
      { label: "b", text: "Dãy số nguyên ngẫu nhiên" },
      { label: "c", text: "Dãy số được sắp xếp theo thứ tự tăng dần" },
      { label: "d", text: "Dãy số được xử lý theo nguyên tắc \"First In, First Out\" (FIFO)" }
    ],
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Question[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedQuestions = applyPagination(questions, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <TopControl title="Questions" />
      <QuestionsFilters />
      <QuestionsTable
        count={paginatedQuestions.length}
        page={page}
        rows={paginatedQuestions}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Question[], page: number, rowsPerPage: number): Question[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
