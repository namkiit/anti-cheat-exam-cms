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
import { Button, Card, CardContent, Divider, FormControl, FormHelperText, List, ListItem, ListItemText, OutlinedInput } from '@mui/material';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Student } from '../dashboard/students/students-table';
import { createStudent, updateStudent } from '@/services/api/student-api';
import { type Severity } from '../toast/toast';
import { useSession } from 'next-auth/react';
import { type Admin } from '@/models/admin-models';

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
    maxHeight: '850px',
    overflowY: 'auto',
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

export function StudentForm({ open, title, data, setOpen, setOpenToast, setMessageToast, setTypeToast }: { open: boolean, title: string, data?: Student, setOpen: (open: boolean) => void, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void, setTypeToast: (type: Severity) => void }): React.JSX.Element {
    console.log(data)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const isEditMode = Boolean(data);
    const session = useSession();

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            const { id, fname, lname, password, assignedExams } = values;
            const accessToken = (session.data?.user as Admin).token;

            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- disable warning
                const res = isEditMode ? await updateStudent(id, fname, lname, password, assignedExams, accessToken) : await createStudent(id, fname, lname, password, assignedExams, accessToken);
                console.log(res);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- disable warning
                if (res.status === 'success') {
                    setMessageToast(`${title} successful`);
                    setTypeToast('success');
                    setOpenToast(true);
                    setOpen(false);
                    reset({ id: '', fname: '', lname: '', password: '', assignedExams: '' }); // clear form input after successful
                } else {
                    setMessageToast(`${title} failed`);
                    setTypeToast('error');
                    setOpenToast(true);
                }
            } catch (error) {
                console.error(`Error ${title}:`, error);
                setMessageToast(`${title} failed`);
                setTypeToast('error');
                setOpenToast(true);
            }
        },
        [isEditMode, reset, session.data?.user, setMessageToast, setOpen, setOpenToast, setTypeToast, title]
    );

    React.useEffect(() => {
        if (data) {
            reset({
                id: data._id,
                fname: data.fname,
                lname: data.lname,
                password: data.password,
                assignedExams: data.assignedExams.map((exam) => exam.examId).join(', '),
            });
        }
    }, [data, reset]);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => { setOpen(false) }}
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
                                    defaultValue={data?._id}
                                    name="id"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.id)}>
                                            <InputLabel>ID</InputLabel>
                                            <OutlinedInput {...field} label="ID" type="text" disabled={isEditMode} />
                                            {errors.id ? <FormHelperText>{errors.id.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    defaultValue={data?.fname}
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
                                    defaultValue={data?.lname}
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
                                    defaultValue={data?.password}
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
                                {data?.submittedExams && data?.submittedExams.length > 0 ? <Typography id="transition-modal-title" variant="h6" component="h6">
                                        Student&apos;s submitted exams:
                                    </Typography> : null}
                                {data?.submittedExams.map((exam) => {
                                    return (
                                        <div key={exam.examId}>
                                            <Card
                                                sx={{
                                                    boxShadow: "none",
                                                    outline: "solid #eeeeee 2px",
                                                }}
                                            >
                                                <CardContent>
                                                    <Stack direction="row" justifyContent="center">
                                                        <Typography
                                                            sx={{ fontSize: 14, marginBottom: "12px" }}
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            ID: {exam?.examId}
                                                        </Typography>
                                                    </Stack>

                                                    <Divider />

                                                    <List>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={`Điểm làm bài: ${exam.score.toString()}`}
                                                                primaryTypographyProps={{ fontSize: 14, fontWeight: "medium" }}
                                                            />
                                                        </ListItem>

                                                        <ListItem>
                                                            <ListItemText
                                                                primary={`Điểm uy tín: ${exam.credibilityScore.toString()} %`}
                                                                primaryTypographyProps={{ fontSize: 14, fontWeight: "medium" }}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                })}
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
