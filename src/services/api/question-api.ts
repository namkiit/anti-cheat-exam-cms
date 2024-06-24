/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Question } from '@/components/dashboard/questions/questions-table';

import axiosInstance from '../axiosInstance';

const getAllQuestions = async (token: string | undefined): Promise<Question[]> => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.get(`/questions/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = res.data;

    return data;
  } catch (e) {
    throw e;
  }
};

const createQuestion = async (id: string, title: string, type: string, answers: object, correctAnswer: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.post(
      `/question/create`,
      {
        _id: id,
        title,
        type,
        answers,
        correctAnswer
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data: any = res.data;

    return data;
  } catch (e) {
    throw e;
  }
};

const updateQuestion = async (id: string, title: string, type: string, answers: object, correctAnswer: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.post(
      `/question/update`,
      {
        _id: id,
        title,
        type,
        answers,
        correctAnswer
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data: any = res.data;

    return data;
  } catch (e) {
    throw e;
  }
};

const deleteQuestion = async (id: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.delete(`/question/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = res.data;

    return data;
  } catch (e) {
    throw e;
  }
};

const findQuestion = async (param: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  try {
    const res = await axiosInstance.get(`/findQuestion/${param}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = res.data;

    return data;
  } catch (e) {
    throw e;
  }
}

export { getAllQuestions, createQuestion, updateQuestion, deleteQuestion, findQuestion };
