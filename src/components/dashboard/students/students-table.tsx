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
import Button from '@mui/material/Button';

import { useSelection } from '@/hooks/use-selection';
import { AssignedExam, SubmittedExam } from '../exams/exams-table';
import { StudentForm } from '@/components/form/student-form';
import { StudentsFilters } from '@/components/dashboard/students/students-filters';
import { TopControl } from '@/components/top-control/top-control';
import { Toast } from '@/components/toast/toast';
import { deleteStudent, getAllStudents } from '@/services/api/student-api';

export interface Student {
  _id: string;
  fname: string;
  lname: string;
  password: string;
  assignedExams: AssignedExam[];
  submittedExams: SubmittedExam[];
  createdAt: Date;
}

export function StudentsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [rows, setRows] = React.useState<Student[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [studentToEdit, setStudentToEdit] = React.useState<Student>({
    _id: '',
    fname: '',
    lname: '',
    password: '',
    assignedExams: [],
    submittedExams: [],
    createdAt: new Date(),
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students: Student[] = await getAllStudents();
        const paginatedStudents = applyPagination(students, page, rowsPerPage);
        setRows(paginatedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    void fetchStudents();
  }, [page, rowsPerPage, messageToast]);

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      const updatedRows = rows.filter((row) => row._id !== id);
      setRows(updatedRows);
      setMessageToast('Delete student successfully');
      setOpenToast(true);
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessageToast('Failed to delete student');
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
      <TopControl title="Students" setOpenToast={setOpenToast} setMessageToast={setMessageToast} />
      <StudentsFilters />
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
                <TableCell>Password</TableCell>
                <TableCell>Number of Assigned Exams</TableCell>
                <TableCell>Number of Submitted Exams</TableCell>
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
                        {/* <Avatar  /> */}
                        <Typography variant="subtitle2">{row.fname} {row.lname}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{'*'.repeat(row.password.length)}</TableCell>
                    <TableCell>{row.assignedExams.map((exam) => { return exam.examId }).length}</TableCell>
                    <TableCell>{row.submittedExams.map((exam) => { return exam.examId }).length}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => {
                        setOpen(true)
                        setStudentToEdit(row)
                      }}>Edit</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => { void handleDeleteStudent(row._id) }}>Delete</Button>
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
        <StudentForm open={open} title='Edit Student' data={studentToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} />
        <Toast message={messageToast} type="success" position="bottom-right" open={openToast} setOpen={setOpenToast} />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Student[], page: number, rowsPerPage: number): Student[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}