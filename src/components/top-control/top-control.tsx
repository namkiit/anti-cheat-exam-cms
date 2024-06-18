'use client'

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Button from '@mui/material/Button';
import { ExamForm } from '@/components/form/exam-form';
import { StudentForm } from '@/components/form/student-form';
import { QuestionForm } from '../form/question-form';
import { Severity } from '../toast/toast';

export function TopControl({ title, setOpenToast, setMessageToast, setTypeToast }: { title: string, setOpenToast: (openToast: boolean) => void, setMessageToast: (message: string) => void, setTypeToast: (type: Severity) => void }): React.JSX.Element {
    const [open, setOpen] = React.useState(false)

    return (
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                <Typography variant="h4">{title}</Typography>
            </Stack>
            <div>
                <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => { setOpen(true) }}>
                    Add
                </Button>
            </div>
            {title === 'Exams' && (<ExamForm open={open} title='Add Exam' setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />)}
            {title === 'Students' && (<StudentForm open={open} title='Add Student' setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />)}
            {title === 'Questions' && (<QuestionForm open={open} title='Add Question' setOpen={setOpen} setOpenToast={setOpenToast} setMessageToast={setMessageToast} setTypeToast={setTypeToast} />)}
        </Stack>
    );
}
