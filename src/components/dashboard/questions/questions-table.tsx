'use client';

import * as React from 'react';
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

import { useSelection } from '@/hooks/use-selection';
import { TopControl } from '@/components/top-control/top-control';
import { QuestionsFilters } from "./questions-filters";
import { deleteQuestion, findQuestion, getAllQuestions } from '@/services/api/question-api';
import Button from '@mui/material/Button';
import { type Severity, Toast } from '@/components/toast/toast';
import { QuestionForm } from '@/components/form/question-form';
import { useSession } from 'next-auth/react';
import { type Admin } from '@/models/admin-models';

export interface Question {
  _id: string;
  title: string;
  type: string;
  answers: Answer[];
  correctAnswer: 'a' | 'b' | 'c' | 'd' | 'A' | 'B' | 'C' | 'D';
}

export interface Answer {
  label: string;
  text: string;
}

export function QuestionsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [allQuestions, setAllQuestions] = React.useState<Question[]>([]);
  const [rows, setRows] = React.useState<Question[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [typeToast, setTypeToast] = React.useState<Severity>('success');
  const [questionToEdit, setQuestionToEdit] = React.useState<Question>({
    _id: '',
    title: '',
    type: '',
    answers: [],
    correctAnswer: 'a',
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';

  React.useEffect(() => {
    const fetchQuestions = async (token: string | undefined): Promise<void> => {
      try {
        const questions: Question[] = await getAllQuestions(token);
        setAllQuestions(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (!isLoadingSession && session?.user) {
      void fetchQuestions((session.user as Admin)?.token);
    }
  }, [isLoadingSession, messageToast, session?.user]);

  React.useEffect(() => {
    const paginatedQuestions = applyPagination(allQuestions, page, rowsPerPage);
    setRows(paginatedQuestions);
  }, [allQuestions, page, rowsPerPage]);

  const handleDeleteQuestion = async (id: string, token: string | undefined): Promise<void> => {
    try {
      await deleteQuestion(id, token);
      const updatedQuestions = allQuestions.filter((row) => row._id !== id);
      setAllQuestions(updatedQuestions);
      setMessageToast('Delete question successfully');
      setTypeToast('success');
      setOpenToast(true);
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessageToast('Failed to delete question');
      setTypeToast('error');
      setOpenToast(true);
    }
  };

  const handleSearch = async (searchText: string, token: string | undefined): Promise<void> => {
    if (searchText) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- temporary
        const filteredQuestions = await findQuestion(searchText, token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- temporary
        setAllQuestions(filteredQuestions.data);
      } catch (error) {
        console.error('Error searching questions:', error);
        setMessageToast('Failed to search questions');
        setTypeToast('error');
        setOpenToast(true);
      }
    } else {
      try {
        const questions: Question[] = await getAllQuestions(token);
        setAllQuestions(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <TopControl title="Questions" setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast}/>
      <QuestionsFilters onSearch={handleSearch}/>
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
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
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
                    <TableCell>{row._id}</TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" onClick={() => {
                          setOpen(true)
                          setQuestionToEdit(row)
                        }}>Edit</Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" onClick={() => { void handleDeleteQuestion(row._id, (session?.user as Admin).token) }}>Delete</Button>
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
          count={allQuestions.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <QuestionForm open={open} title='Edit Question' data={questionToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
        <Toast message={messageToast} type={typeToast} position="bottom-right" open={openToast} setOpen={setOpenToast} />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Question[], page: number, rowsPerPage: number): Question[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
