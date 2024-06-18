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
import { Button, FormControl, MenuItem, OutlinedInput, Select } from '@mui/material';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExam, updateExam } from '@/services/api/exam-api';
import { type Exam } from '../dashboard/exams/exams-table';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Severity } from '../toast/toast';

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

const status = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
] as const;

const schema = zod.object({
    id: zod.string().min(1, { message: 'ID is required' }),
    name: zod.string().min(1, { message: 'Name is required' }),
    questions: zod.string().min(1, { message: 'Questions is required' }),
    duration: zod.number().min(1, { message: 'Duration is required' }),
    status: zod.string().min(1, { message: 'Status is required' }),
    startDate: zod.date().min(dayjs().toDate(), { message: 'Start date is required' }),
    endDate: zod.date().min(dayjs().toDate(), { message: 'End date is required' }),
});

type Values = zod.infer<typeof schema>;

export function ExamForm({ open, title, data, setOpen, setOpenToast, setMessageToast, setTypeToast }: { open: boolean, title: string, data?: Exam, setOpen: (open: boolean) => void, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void, setTypeToast: (type: Severity) => void }): React.JSX.Element {
    console.log({data})
    const {
        control,
        handleSubmit,
        reset,
        // setError,
        // formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });
    const isEditMode = Boolean(data);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            console.log(values);
            const { id, name, questions, duration, startDate, endDate } = values;
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- disable warning
                const res = isEditMode ? await updateExam(id, name, questions, duration, startDate.toISOString(), endDate.toISOString()) : await createExam(id, name, questions, duration, startDate.toISOString(), endDate.toISOString());
                console.log(res);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- disable warning
                if (res.status === 'success') {
                    setMessageToast(`${title} successful`);
                    setTypeToast('success');
                    setOpenToast(true);
                    setOpen(false);
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
        [isEditMode, setMessageToast, setOpen, setOpenToast, title]
    );

    React.useEffect(() => {
        if (data) {
            reset({
                id: data._id,
                name: data.name,
                questions: data.questions.join(', '),
                duration: data.duration,
                status: data.status,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
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
                                            <OutlinedInput {...field} label="ID" type="text" />
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
                                            <InputLabel>Duration</InputLabel>
                                            <OutlinedInput {...field} label="Duration" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="status"
                                    defaultValue={data?.status}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Status</InputLabel>
                                            <Select label="Status" variant="outlined" {...field} >
                                                {status.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="startDate"
                                    defaultValue={data?.startDate ? new Date(data.startDate) : undefined}
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
                                    defaultValue={data?.endDate ? new Date(data.endDate) : undefined}
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
