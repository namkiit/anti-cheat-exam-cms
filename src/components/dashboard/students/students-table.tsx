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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useSelection } from '@/hooks/use-selection';
import { AssignedExam } from '../exams/exams-table';
import { StudentForm } from '@/components/form/student-form';
import { Toast } from '@/components/toast/toast';

function noop(): void {
  // do nothing
}

export interface Student {
  _id: string;
  fname: string;
  lname: string;
  password: string;
  assignedExams: AssignedExam[];
  submittedExams: object[];
  createdAt: Date;
}

interface StudentTableProps {
  count?: number;
  page?: number;
  rows?: Student[];
  rowsPerPage?: number;
}

export function StudentsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: StudentTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((row) => row._id);
  }, [rows]);

  const [open, setOpen] = React.useState(false)
  const [studentToEdit, setStudentToEdit] = React.useState<Student>({
    _id: '',
    fname: '',
    lname: '',
    password: '',
    assignedExams: [],
    submittedExams: [],
    createdAt: new Date(),
  })

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
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
                    <Button variant="outlined" color="error">Delete</Button>
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
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <StudentForm open={open} title='Edit Student' handleClose={() => { setOpen(false) }} data={studentToEdit} />
      <Toast message="Hello" type="success" position="bottom-right" />
    </Card>
  );
}
