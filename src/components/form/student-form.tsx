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
    // email: zod.string().min(1, { message: 'Email is required' }).email(),
    id: zod.string().min(1, { message: 'ID is required' }),
    fname: zod.string().min(1, { message: 'First Name is required' }),
    lname: zod.string().min(1, { message: 'Last Name is required' }),
    password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

export function StudentForm({ open, handleClose }: { open: boolean, handleClose: () => void }): React.JSX.Element {
    const {
        control,
        handleSubmit,
        // setError,
        // formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

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
                            Add Student
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
                                    name="fname"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>First Name</InputLabel>
                                            <OutlinedInput {...field} label="First Name" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="lname"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Last Name</InputLabel>
                                            <OutlinedInput {...field} label="Last Name" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Password</InputLabel>
                                            <OutlinedInput {...field} label="Duration" type="text" />
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
