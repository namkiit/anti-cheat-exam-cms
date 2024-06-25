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
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { ExamForm } from '@/components/form/exam-form';
import { TopControl } from '@/components/top-control/top-control';
import { ExamsFilters } from './exams-filters';
import { deleteExam, getAllExams, findExam } from '@/services/api/exam-api';
import { type Severity, Toast } from '@/components/toast/toast';
import { useSession } from 'next-auth/react';
import { type Admin } from '@/models/admin-models';

export interface Exam {
  _id: string;
  name: string;
  questions: string[];
  duration: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: Date;
}

export interface AssignedExam {
  examId: string;
}

export interface SubmittedExam extends AssignedExam {
  examId: string;
  score: number;
  credibilityScore: number;
  answers: object[];
}

export function ExamsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [allExams, setAllExams] = React.useState<Exam[]>([]);
  const [rows, setRows] = React.useState<Exam[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [typeToast, setTypeToast] = React.useState<Severity>('success');
  const [examToEdit, setExamToEdit] = React.useState<Exam>({
    _id: '',
    name: '',
    questions: [],
    duration: '',
    status: '',
    startDate: '',
    endDate: '',
    createdAt: new Date(),
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';

  React.useEffect(() => {
    const fetchExams = async (token: string | undefined): Promise<void> => {
      try {
        const exams: Exam[] = await getAllExams(token);
        setAllExams(exams);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    if (!isLoadingSession && session?.user) {
      void fetchExams((session.user as Admin)?.token);
    }
  }, [isLoadingSession, messageToast, session?.user]);

  React.useEffect(() => {
    const paginatedExams = applyPagination(allExams, page, rowsPerPage);
    setRows(paginatedExams);
  }, [allExams, page, rowsPerPage]);

  const handleDeleteExam = async (id: string, token: string | undefined): Promise<void> => {
    try {
      await deleteExam(id, token);
      setAllExams(allExams.filter((exam) => exam._id !== id));
      setMessageToast('Delete exam successfully');
      setTypeToast('success');
      setOpenToast(true);
    } catch (error) {
      console.error('Error deleting exam:', error);
      setMessageToast('Failed to delete exam');
      setTypeToast('error');
      setOpenToast(true);
    }
  };

  const handleSearch = async (searchText: string, token: string | undefined): Promise<void> => {
    if (searchText) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- temporary
        const filteredExams = await findExam(searchText, token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- temporary
        setAllExams(filteredExams.data);
      } catch (error) {
        console.error('Error searching exams:', error);
        setMessageToast('Failed to search exams');
        setTypeToast('error');
        setOpenToast(true);
      }
    } else {
      try {
        const exams: Exam[] = await getAllExams(token);
        setAllExams(exams);
      } catch (error) {
        console.error('Error fetching exams:', error);
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
      <TopControl title="Exams" setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
      <ExamsFilters onSearch={handleSearch} />
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
                <TableCell>Name</TableCell>
                <TableCell>Question Count</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
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
                    <TableCell>{row._id}</TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.questions.length}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{dayjs(row.startDate).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{dayjs(row.endDate).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => {
                        setOpen(true);
                        setExamToEdit(row);
                      }}>Edit</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => { void handleDeleteExam(row._id, (session?.user as Admin).token) }}>Delete</Button>
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
          count={allExams.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <ExamForm open={open} title="Edit Exam" data={examToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
        <Toast message={messageToast} type={typeToast} position="bottom-right" open={openToast} setOpen={setOpenToast} />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Exam[], page: number, rowsPerPage: number): Exam[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
