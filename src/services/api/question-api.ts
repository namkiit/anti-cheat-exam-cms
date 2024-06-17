/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Question } from '@/components/dashboard/questions/questions-table';

import axiosInstance from '../axiosInstance';

const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const res = await axiosInstance.get(`/questions/`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    const data: any = res.data;

    // if (res.status >= 200 && res.status < 300 || data.err) {
    //   throw new Error(data.err || "Failed to get exam from server!");
    // }

    return data;
  } catch (e) {
    throw e;
  }
};

const createQuestion = async (id: string, title: string, type: string, answers: object, correctAnswer: string) => {
  try {
    const res = await axiosInstance.post(`/question/create`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      title,
      type,
      answers,
      correctAnswer
    });

    const data: any = res.data;

    // if (res.status >= 200 && res.status < 300 || data.err) {
    //   throw new Error(data.err || "Failed to get exam from server!");
    // }

    return data;
  } catch (e) {
    throw e;
  }
};

const updateQuestion = async (id: string, title: string, type: string, answers: object, correctAnswer: string) => {
  try {
    const res = await axiosInstance.post(`/question/update`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      title,
      type,
      answers,
      correctAnswer
    });

    const data: any = res.data;

    // if (res.status >= 200 && res.status < 300 || data.err) {
    //   throw new Error(data.err || "Failed to get exam from server!");
    // }

    return data;
  } catch (e) {
    throw e;
  }
};

const deleteQuestion = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/question/${id}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    const data: any = res.data;

    // if (res.status >= 200 && res.status < 300 || data.err) {
    //   throw new Error(data.err || "Failed to get exam from server!");
    // }

    return data;
  } catch (e) {
    throw e;
  }
};

export { getAllQuestions, createQuestion, updateQuestion, deleteQuestion };
