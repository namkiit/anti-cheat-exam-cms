'use client';

import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { TopControl } from '@/components/top-control/top-control';
import { QuestionsFilters } from "./questions-filters";
import { deleteQuestion, getAllQuestions } from '@/services/api/question-api';
import Button from '@mui/material/Button';
import { Toast } from '@/components/toast/toast';
import { QuestionForm } from '@/components/form/question-form';

export interface Question {
  _id: string;
  title: string;
  type: string;
  answers: Answer[];
  correctAnswer: string;
  createdAt: Date;
}

export interface Answer {
  label: string;
  text: string;
}

export function QuestionsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [rows, setRows] = React.useState<Question[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [questionToEdit, setQuestionToEdit] = React.useState<Question>({
    _id: '',
    title: '',
    type: '',
    answers: [],
    correctAnswer: '',
    createdAt: new Date(),
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions: Question[] = await getAllQuestions();
        const paginatedQuestions = applyPagination(questions, page, rowsPerPage);
        setRows(paginatedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    void fetchQuestions();
  }, [page, rowsPerPage, messageToast]);

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      const updatedRows = rows.filter((row) => row._id !== id);
      setRows(updatedRows);
      setMessageToast('Delete question successfully');
      setOpenToast(true);
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessageToast('Failed to delete question');
      setOpenToast(true);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <TopControl title="Questions" setOpenToast={setOpenToast} setMessageToast={setMessageToast} />
      <QuestionsFilters />
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      {/* <Avatar  /> */}
                      <Typography variant="subtitle2">{row.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                      <Button variant="contained" onClick={() => {
                        setOpen(true)
                        setQuestionToEdit(row)
                      }}>Edit</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => { void handleDeleteQuestion(row._id) }}>Delete</Button>
                    </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={rows.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <QuestionForm open={open} title='Edit Student' data={questionToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} />
      <Toast message={messageToast} type="success" position="bottom-right" open={openToast} setOpen={setOpenToast} />
    </Card>
    </Stack>
  );
}

function applyPagination(rows: Question[], page: number, rowsPerPage: number): Question[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}