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

import { useSelection } from '@/hooks/use-selection';
import { type AssignedExam, type SubmittedExam } from '../exams/exams-table';
import { StudentForm } from '@/components/form/student-form';
import { StudentsFilters } from '@/components/dashboard/students/students-filters';
import { TopControl } from '@/components/top-control/top-control';
import { type Severity, Toast } from '@/components/toast/toast';
import { deleteStudent, findStudent, getAllStudents } from '@/services/api/student-api';
import { useSession } from 'next-auth/react';
import { type Admin } from '@/models/admin-models';

export interface Student {
  _id: string;
  fname: string;
  lname: string;
  password: string;
  assignedExams: AssignedExam[];
  submittedExams: SubmittedExam[];
}

export function StudentsTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  const [rows, setRows] = React.useState<Student[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<string>('');
  const [typeToast, setTypeToast] = React.useState<Severity>('success');
  const [studentToEdit, setStudentToEdit] = React.useState<Student>({
    _id: '',
    fname: '',
    lname: '',
    password: '',
    assignedExams: [],
    submittedExams: [],
  });

  const rowIds = React.useMemo(() => rows.map((row) => row._id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';

  React.useEffect(() => {
    const fetchStudents = async (token: string | undefined): Promise<void> => {
      try {
        const students: Student[] = await getAllStudents(token);
        setAllStudents(students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (!isLoadingSession && session?.user) {
      void fetchStudents((session.user as Admin)?.token);
    }
  }, [isLoadingSession, messageToast, session?.user]);

  React.useEffect(() => {
    const paginatedStudents = applyPagination(allStudents, page, rowsPerPage);
    setRows(paginatedStudents);
  }, [allStudents, page, rowsPerPage]);

  const handleDeleteStudent = async (id: string, token: string | undefined): Promise<void> => {
    try {
      await deleteStudent(id, token);
      setMessageToast('Delete student successfully');
      setTypeToast('success');
      setOpenToast(true);
      setAllStudents(allStudents.filter((student) => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessageToast('Failed to delete student');
      setTypeToast('error');
      setOpenToast(true);
    }
  };

  const handleSearch = async (searchText: string, token: string | undefined): Promise<void> => {
    if (searchText) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- temporary
        const filteredStudents = await findStudent(searchText, token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- temporary
        setAllStudents(filteredStudents.data);
      } catch (error) {
        console.error('Error searching students:', error);
        setMessageToast('Failed to search students');
        setTypeToast('error');
        setOpenToast(true);
      }
    } else {
      try {
        const students: Student[] = await getAllStudents(token);
        setAllStudents(students);
      } catch (error) {
        console.error('Error fetching students:', error);
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
      <TopControl title="Students" setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
      <StudentsFilters onSearch={handleSearch} />
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
                    <TableCell>{row.assignedExams.length}</TableCell>
                    <TableCell>{row.submittedExams.length}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => {
                        setOpen(true)
                        setStudentToEdit(row)
                      }}>Edit</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => { void handleDeleteStudent(row._id, (session?.user as Admin).token) }}>Delete</Button>
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
          count={allStudents.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <StudentForm open={open} title='Edit Student' data={studentToEdit} setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />
        <Toast message={messageToast} type={typeToast} position="bottom-right" open={openToast} setOpen={setOpenToast} />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Student[], page: number, rowsPerPage: number): Student[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
