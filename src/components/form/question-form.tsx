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
import { type Question } from '../dashboard/questions/questions-table';
import { createQuestion, updateQuestion } from '@/services/api/question-api';
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

type AnswerFieldNames = 'answerA' | 'answerB' | 'answerC' | 'answerD';

const answerFieldNames: AnswerFieldNames[] = ['answerA', 'answerB', 'answerC', 'answerD'];

const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
] as const;

const schema = zod.object({
    id: zod.string().min(1, { message: 'ID is required' }),
    title: zod.string().min(1, { message: 'Title is required' }),
    type: zod.string().min(1, { message: 'Type is required' }),
    answerA: zod.string().min(1, { message: 'Answer A is required' }),
    answerB: zod.string().min(1, { message: 'Answer B is required' }),
    answerC: zod.string().min(1, { message: 'Answer C is required' }),
    answerD: zod.string().min(1, { message: 'Answer D is required' }),
    correctAnswer: zod.enum(['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D']),
});

type Values = zod.infer<typeof schema>;

export function QuestionForm({ open, title: titleForm, data, setOpen, setOpenToast, setMessageToast, setTypeToast }: { open: boolean, title: string, data?: Question, setOpen: (open: boolean) => void, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void, setTypeToast: (type: Severity) => void }): React.JSX.Element {
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
            const { id, title, type, answerA, answerB, answerC, answerD, correctAnswer } = values;
            const answerVariables = { answerA, answerB, answerC, answerD };
            type AnswerKeys = keyof typeof answerVariables;
            const answers = Object.keys(answerVariables).map((key, index) => {
                const label = String.fromCharCode(97 + index); // Convert index to a corresponding letter (97 is 'a' in ASCII)
                return { label, text: answerVariables[key as AnswerKeys] };
            });
            const accessToken = (session.data?.user as Admin).token;

            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- disable warning
                const res = isEditMode ? await updateQuestion(id, title, type, answers, correctAnswer.toLowerCase(), accessToken) : await createQuestion(id, title, type, answers, correctAnswer.toLowerCase(), accessToken);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- disable warning
                if (res.status === 'success') {
                    setMessageToast(`${titleForm} successful`);
                    setTypeToast('success');
                    setOpenToast(true);
                    setOpen(false);
                    reset({ id: '', title: '', type: '', answerA: '', answerB: '', answerC: '', answerD: '', correctAnswer: 'a' }); // clear form input after successful
                } else {
                    setMessageToast(`${titleForm} failed`);
                    setTypeToast('error');
                    setOpenToast(true);
                }
            } catch (error) {
                console.error(`Error ${titleForm}:`, error);
                setMessageToast(`${titleForm} failed`);
                setTypeToast('error');
                setOpenToast(true);
            }
        },
        [isEditMode, reset, session.data?.user, setMessageToast, setOpen, setOpenToast, setTypeToast, titleForm]
    );

    React.useEffect(() => {
        if (data) {
            reset({
                id: data._id,
                title: data.title,
                type: data.type,
                answerA: data.answers[0]?.text,
                answerB: data.answers[1]?.text,
                answerC: data.answers[2]?.text,
                answerD: data.answers[3]?.text,
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
                                            <OutlinedInput {...field} label="Title" type="text" />
                                            {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="type"
                                    defaultValue={data?.type ?? 'multiple-choice'}
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors.type)}>
                                            <InputLabel>Type</InputLabel>
                                            <Select label="Type" variant="outlined" {...field} >
                                                {questionTypes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.type ? <FormHelperText>{errors.type.message}</FormHelperText> : null}
                                        </FormControl>
                                    )}
                                />
                                {answerFieldNames.map((fieldName, index) => (
                                    <Controller
                                        key={fieldName}
                                        control={control}
                                        defaultValue={data?.answers ? data.answers[index]?.text : ''}
                                        name={fieldName}
                                        render={({ field }) => (
                                            <FormControl error={Boolean(errors[fieldName])}>
                                                <InputLabel>{`Answer ${String.fromCharCode(65 + index)}`}</InputLabel>
                                                <OutlinedInput {...field} label={`Answer ${String.fromCharCode(65 + index)}`} type="text" />
                                                {errors[fieldName] ? <FormHelperText>{errors[fieldName]?.message}</FormHelperText> : null}
                                            </FormControl>
                                        )}
                                    />
                                ))}
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
