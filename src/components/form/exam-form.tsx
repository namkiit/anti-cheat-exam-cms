/* eslint-disable @typescript-eslint/no-explicit-any -- disable error type warning */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- disable warning */
/* eslint-disable @typescript-eslint/no-unsafe-call -- disable warning */
/* eslint-disable @typescript-eslint/no-unsafe-argument -- disable warning */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- disable warning */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- disable warning */
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
import { Button, FormControl, FormHelperText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExam, updateExam } from '@/services/api/exam-api';
import { type Exam } from '../dashboard/exams/exams-table';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
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
};

const examStatus = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
] as const;

const schema = zod.object({
    id: zod.string().min(1, { message: 'ID is required' }),
    name: zod.string().min(1, { message: 'Name is required' }),
    questions: zod.string().optional(),
    duration: zod.string().min(1, { message: 'Duration is required' }),
    status: zod.string().min(1, { message: 'Status is required' }),
    startDate: zod.any(),
    endDate: zod.any(),
});

type Values = zod.infer<typeof schema>;

export function ExamForm({ open, title, data, setOpen, setOpenToast, setMessageToast, setTypeToast }: { open: boolean, title: string, data?: Exam, setOpen: (open: boolean) => void, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void, setTypeToast: (type: Severity) => void }): React.JSX.Element {
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
            const { id, name, questions, duration, status, startDate, endDate } = values;
            const accessToken = (session.data?.user as Admin).token;
            try {
                const res = isEditMode ? await updateExam(id, name, questions, Number(duration), status, startDate.toISOString(), endDate.toISOString(), accessToken) : await createExam(id, name, questions, Number(duration), status, startDate.toISOString(), endDate.toISOString(), accessToken);
                
                if (res.status === 'success') {
                    setMessageToast(`${title} successful`);
                    setTypeToast('success');
                    setOpenToast(true);
                    setOpen(false);
                    reset({ id: '', name: '', questions: '', duration: '', status: '', startDate: '', endDate: '' }); // clear form input after successful
                } else {
                    setMessageToast(`${title} failed`);
                    setTypeToast('error');
                    setOpenToast(true);
                }
            } catch (error: any) {
                console.error(`Error ${title}:`, error);
                setMessageToast(`${title} failed - ${error?.response?.data?.message}`);
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
                name: data.name,
                questions: data.questions.join(', '),
                duration: data.duration,
                status: data.status,
                startDate: dayjs(data.startDate),
                endDate: dayjs(data.endDate),
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
                                    name="id"
                                    defaultValue={data?._id}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>ID</InputLabel>
                                            <OutlinedInput {...field} label="ID" type="text" disabled={isEditMode} />
                                            {errors.id ? <FormHelperText>{errors.id.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="name"
                                    defaultValue={data?.name}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Name</InputLabel>
                                            <OutlinedInput {...field} label="Name" type="text" />
                                            {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="questions"
                                    defaultValue={data?.questions.join(', ')}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Questions&apos; IDs (separated by comma)</InputLabel>
                                            <OutlinedInput {...field} label="Questions&apos; IDs (separated by comma)" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="duration"
                                    defaultValue={data?.duration}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Duration (seconds)</InputLabel>
                                            <OutlinedInput {...field} label="Duration (seconds)" type="number" />
                                            {errors.duration ? <FormHelperText>{errors.duration.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="status"
                                    defaultValue={data?.status ?? ''}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Status</InputLabel>
                                            <Select label="Status" variant="outlined" {...field} >
                                                {examStatus.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.status ? <FormHelperText>{errors.status.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="startDate"
                                    defaultValue={data?.startDate ? dayjs(data?.startDate) : null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                {...field}
                                                label="Start Date"
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="endDate"
                                    defaultValue={data?.endDate ? dayjs(data?.endDate) : null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                {...field}
                                                label="End Date"
                                            />
                                        </LocalizationProvider>
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
