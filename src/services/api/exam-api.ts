/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Exam } from "@/components/dashboard/exams/exams-table";
import axiosInstance from "../axiosInstance";

const getAllExams = async (token: string | undefined): Promise<Exam[]> => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.get(`/exams/`, {
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

const createExam = async (id: string, name: string, questions: string, duration: number, status: string, startDate: string, endDate: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.post(
      `/exam/create`,
      {
        _id: id,
        name,
        questions: questions?.split(",").map((questionId) => questionId.trim()),
        duration,
        status,
        startDate,
        endDate
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

const updateExam = async (id: string, name: string, questions: string, duration: number, status: string, startDate: string, endDate: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  try {
    const res = await axiosInstance.post(
      `/exam/update`,
      {
        _id: id,
        name,
        questions: questions?.split(',').map((questionId) => questionId.trim()),
        duration,
        status,
        startDate,
        endDate
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

const deleteExam = async (id: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  try {
    const res = await axiosInstance.delete(`/exam/${id}`, {
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

const findExam = async (param: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  try {
    const res = await axiosInstance.get(`/findExam/${param}`, {
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

export { getAllExams, createExam, updateExam, deleteExam, findExam };
