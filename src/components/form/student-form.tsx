'use client'

import * as React from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { Alert, Button, FormControl, FormHelperText, Grid, OutlinedInput } from '@mui/material';
import { z as zod } from 'zod';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { zodResolver } from '@hookform/resolvers/zod';
import { Student } from '../dashboard/students/students-table';
import { createStudent } from '@/services/api/student-api';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
// import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const schema = zod.object({
    // email: zod.string().min(1, { message: 'Email is required' }).email(),
    id: zod.string().min(1, { message: 'ID is required' }),
    fname: zod.string().min(1, { message: 'First Name is required' }),
    lname: zod.string().min(1, { message: 'Last Name is required' }),
    password: zod.string().min(1, { message: 'Password is required' }),
    assignedExams: zod.string().optional()
});

type Values = zod.infer<typeof schema>;

export function StudentForm({ open, title, data, handleClose }: { open: boolean, title: string, data?: Student, handleClose: () => void }): React.JSX.Element {
    const {
        control,
        handleSubmit,
        // setValue,
        // setError,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
          console.log(values)
          const { id, fname, lname, password, assignedExams } = values;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- temporary
          const res = await createStudent(id, fname, lname, password, assignedExams)
          console.log(res)
        },
        []
      );

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Stack spacing={4}>
                        <Typography id="transition-modal-title" variant="h4" component="h2">
                            {title}
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)} className="">
                            <Stack spacing={2}>
                                <Controller
                                    control={control}
                                    // defaultValue={data?._id}
                                    name="id"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.id)}>
                                            <InputLabel>ID</InputLabel>
                                            <OutlinedInput {...field} label="ID" type="text" />
                                            {errors.id ? <FormHelperText>{errors.id.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    // defaultValue={data?.fname}
                                    name="fname"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.fname)}>
                                            <InputLabel>First Name</InputLabel>
                                            <OutlinedInput {...field} label="First Name" type="text" />
                                            {errors.fname ? <FormHelperText>{errors.fname.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    // defaultValue={data?.lname}
                                    name="lname"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.lname)}>
                                            <InputLabel>Last Name</InputLabel>
                                            <OutlinedInput {...field} label="Last Name" type="text" />
                                            {errors.lname ? <FormHelperText>{errors.lname.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    // defaultValue={data?.password}
                                    name="password"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.password)}>
                                            <InputLabel>Password</InputLabel>
                                            <OutlinedInput {...field} label="Password" type="text" />
                                            {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    defaultValue={data?.assignedExams.map((exam) => { return exam.examId }).join(', ')}
                                    name="assignedExams"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Assigned Exams (input as a multiple strings separated by comma)</InputLabel>
                                            <OutlinedInput {...field} label="Assigned Exams (input as a multiple strings separated by comma)" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                                    {title}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}
