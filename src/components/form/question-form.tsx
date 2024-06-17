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
import { Button, FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Question } from '../dashboard/questions/questions-table';
import { createQuestion, updateQuestion } from '@/services/api/question-api';
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
    title: zod.string().min(1, { message: 'Title is required' }),
    type: zod.string().min(1, { message: 'Type is required' }),
    answers: zod.object({
        a: zod.string(),
        b: zod.string(),
        c: zod.string(),
        d: zod.string(),
        // Add more properties as needed
    }),
    correctAnswer: zod.string().min(1, { message: 'Correct Answer is required' }),
});

type Values = zod.infer<typeof schema>;

export function QuestionForm({ open, title: titleForm, data, setOpen, setOpenToast, setMessageToast }: { open: boolean, title: string, data?: Question, setOpen: (open: boolean) => void, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void }): React.JSX.Element {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const isEditMode = Boolean(data);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            console.log(values);
            const { id, title, type, answers, correctAnswer } = values;
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- disable warning
                const res = isEditMode ? await updateQuestion(id, title, type, answers, correctAnswer) : await createQuestion(id, title, type, answers, correctAnswer);
                console.log(res);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- disable warning
                if (res.status === 'success') {
                    setMessageToast(`${titleForm} successful`);
                    setOpenToast(true);
                    setOpen(false);
                } else {
                    setMessageToast(`${titleForm} failed`);
                    setOpenToast(true);
                }
            } catch (error) {
                console.error(`Error ${titleForm}:`, error);
                setMessageToast(`${titleForm} failed`);
                setOpenToast(true);
            }
        },
        [isEditMode, setMessageToast, setOpen, setOpenToast, titleForm]
    );

    React.useEffect(() => {
        if (data) {
            reset({
                id: data._id,
                title: data.title,
                type: data.type,
                answers: data.answers,
                correctAnswer: data.correctAnswer,
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
                            {titleForm}
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
                                    defaultValue={data?.title}
                                    name="title"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.title)}>
                                            <InputLabel>Title</InputLabel>
                                            <OutlinedInput {...field} label="First Name" type="text" />
                                            {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    defaultValue={data?.type}
                                    name="type"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.type)}>
                                            <InputLabel>Type</InputLabel>
                                            <OutlinedInput {...field} label="Last Name" type="text" />
                                            {errors.type ? <FormHelperText>{errors.type.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    defaultValue={data?.correctAnswer}
                                    name="correctAnswer"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.correctAnswer)}>
                                            <InputLabel>Correct Answer</InputLabel>
                                            <OutlinedInput {...field} label="Correct Answer" type="text" />
                                            {errors.correctAnswer ? <FormHelperText>{errors.correctAnswer.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    defaultValue={data?.answers}
                                    name="answers"
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel>Answers</InputLabel>
                                            <OutlinedInput {...field} label="Assigned Exams (input as a multiple strings separated by comma)" type="text" />
                                        </FormControl>
                                    )}
                                />
                                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                                    {titleForm}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}
