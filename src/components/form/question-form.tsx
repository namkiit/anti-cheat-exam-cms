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

const schema = zod.object({
    email: zod.string().min(1, { message: 'Email is required' }).email(),
    password: zod.string().min(1, { message: 'Password is required' }),
    id: zod.string().min(1, { message: 'Password is required' }),
    name: zod.string().min(1, { message: 'Name is required' }),
    questionCount: zod.number().min(1, { message: 'Number of questions is required' }),
    duration: zod.number().min(1, { message: 'Duration is required' }),
    status: zod.string().min(1, { message: 'Status is required' }),
    startDate: zod.string().min(1, { message: 'Start date is required' }),
    endDate: zod.string().min(1, { message: 'End date is required' }),
});

type Values = zod.infer<typeof schema>;
const defaultValues = { email: '', password: '', id: '', name: '', questionCount: 0, duration: 0, status: '', startDate: '', endDate: '' } satisfies Values;

export function QuestionForm({ open, handleClose }: { open: boolean, handleClose: () => void }): React.JSX.Element {
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
                            Add Question
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
                                            <OutlinedInput {...field} label="Status" type="text" />
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
                                {/* <Controller
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.email)}>
                                            <InputLabel>Email address</InputLabel>
                                            <OutlinedInput {...field} label="Email address" type="email" />
                                            {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.password)}>
                                            <InputLabel>Password</InputLabel>
                                            <OutlinedInput
                                                {...field}
                                                label="Password"
                                                type='text'
                                            />
                                            {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                                <Button type="submit" variant="contained">
                                    Submit
                                </Button> */}
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}
