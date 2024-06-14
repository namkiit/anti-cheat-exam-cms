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
import { Alert, Button, FormControl, FormHelperText, Grid, MenuItem, OutlinedInput, Select } from '@mui/material';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const status = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
  ] as const;

const schema = zod.object({
    id: zod.string().min(1, { message: 'ID is required' }),
    name: zod.string().min(1, { message: 'Name is required' }),
    questionCount: zod.number().min(1, { message: 'Number of questions is required' }),
    duration: zod.number().min(1, { message: 'Duration is required' }),
    status: zod.string().min(1, { message: 'Status is required' }),
    startDate: zod.string().min(1, { message: 'Start date is required' }),
    endDate: zod.string().min(1, { message: 'End date is required' }),
});

type Values = zod.infer<typeof schema>;
const defaultValues = { id: '', name: '', questionCount: 0, duration: 0, status: '', startDate: '', endDate: '' } satisfies Values;

export function ExamForm({ open, title, handleClose }: { open: boolean, title: string, handleClose: () => void }): React.JSX.Element {
    const {
        control,
        handleSubmit,
        // setError,
        // formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = () => {
        console.log('submit form')
    }

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
                                    name="id"
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
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Name</InputLabel>
                                            <OutlinedInput {...field} label="Name" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="questionCount"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Number of questions</InputLabel>
                                            <OutlinedInput {...field} label="Number of questions" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="duration"
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
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Status</InputLabel>
                                            <Select defaultValue="Hanoi" label="Status" name="status" variant="outlined">
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
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Start Date</InputLabel>
                                            <OutlinedInput {...field} label="Start Date" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>End Date</InputLabel>
                                            <OutlinedInput {...field} label="End Date" type="text" />
                                        </FormControl>
                                    )}
                                />
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}
