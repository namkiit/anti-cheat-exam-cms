/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Exam } from "@/components/dashboard/exams/exams-table";
import axiosInstance from "../axiosInstance";

const getAllExams = async (): Promise<Exam[]> => {
  try {
    const res = await axiosInstance.get(`/exams/`, {
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

const createExam = async (id: string, name: string, questions: string, duration: number, status: string, startDate: string, endDate: string) => {
  try {
    const res = await axiosInstance.post(`/exam/create`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      name,
      questions: questions?.split(',').map(questionId => questionId.trim()),
      duration,
      status,
      startDate,
      endDate
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

const updateExam = async (id: string, name: string, questions: string, duration: number, status: string, startDate: string, endDate: string) => {
  try {
    const res = await axiosInstance.post(`/exam/update`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      name,
      questions: questions?.split(',').map(questionId => questionId.trim()),
      duration,
      status,
      startDate,
      endDate
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

const deleteExam = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/exam/${id}`, {
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

export { getAllExams, createExam, updateExam, deleteExam };
