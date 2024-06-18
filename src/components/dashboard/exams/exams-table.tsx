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
import { deleteExam, getAllExams } from '@/services/api/exam-api';
import { type Severity, Toast } from '@/components/toast/toast';

export interface Exam {
  _id: string;
  name: string;
  questions: string[];
  duration: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: Date;
}

export interface AssignedExam {
  examId: string;
}

export interface SubmittedExam extends AssignedExam {
  answers: any[];
}

export function ExamsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Exam[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [typeToast, setTypeToast] = React.useState<Severity>('success');
  const [examToEdit, setExamToEdit] = React.useState<Exam>({
    _id: '',
    name: '',
    questions: [],
    duration: 0,
    status: '',
    startDate: '',
    endDate: '',
    createdAt: new Date(),
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  React.useEffect(() => {
    const fetchExams = async (): Promise<void> => {
      try {
        const exams: Exam[] = await getAllExams();
        setRows(exams);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    void fetchExams();
  }, [messageToast]);

  const handleDeleteExam = async (id: string): Promise<void> => {
    try {
      await deleteExam(id);
      const updatedRows = rows.filter((row) => row._id !== id);
      setRows(updatedRows);
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

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = applyPagination(rows, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <TopControl title="Exams" setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
      <ExamsFilters />
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
              {paginatedRows.map((row) => {
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
                      <Button variant="outlined" color="error" onClick={() => { void handleDeleteExam(row._id) }}>Delete</Button>
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
        <ExamForm open={open} title="Edit Exam" data={examToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
        <Toast message={messageToast} type={typeToast} position="bottom-right" open={openToast} setOpen={setOpenToast} />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Exam[], page: number, rowsPerPage: number): Exam[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
