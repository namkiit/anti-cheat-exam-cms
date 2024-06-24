/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Student } from '@/components/dashboard/students/students-table';

import axiosInstance from '../axiosInstance';

const getAllStudents = async (token: string | undefined): Promise<Student[]> => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  try {
    const res = await axiosInstance.get(`/students/`, {
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

const createStudent = async (
  id: string,
  fname: string,
  lname: string,
  password: string,
  assignedExams: string | undefined,
  token: string | undefined
) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.post(
      `/student/create`,
      {
        _id: id,
        fname,
        lname,
        password,
        assignedExams: assignedExams?.split(",").map((examId) => ({
          examId: examId.trim()
        }))
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

const updateStudent = async (
  id: string,
  fname: string,
  lname: string,
  password: string,
  assignedExams: string | undefined,
  token: string | undefined
) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.post(
      `/student/update`,
      {
        _id: id,
        fname,
        lname,
        password,
        assignedExams: assignedExams?.split(",").map((examId) => ({
          examId: examId.trim()
        }))
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


const deleteStudent = async (id: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.delete(`/student/${id}`, {
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

const findStudent = async (param: string, token: string | undefined) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const res = await axiosInstance.get(`/findStudent/${param}`, {
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

export { getAllStudents, createStudent, updateStudent, deleteStudent, findStudent };
