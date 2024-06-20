/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { type Student } from '@/components/dashboard/students/students-table';

import axiosInstance from '../axiosInstance';

const getAllStudents = async (): Promise<Student[]> => {
  try {
    const res = await axiosInstance.get(`/students/`, {
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

const createStudent = async (
  id: string,
  fname: string,
  lname: string,
  password: string,
  assignedExams: string | undefined
) => {
  try {
    const res = await axiosInstance.post(`/student/create`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      fname,
      lname,
      password,
      assignedExams: assignedExams?.split(',').map((examId) => ({
        examId: examId.trim(),
      })),
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

const updateStudent = async (
  id: string,
  fname: string,
  lname: string,
  password: string,
  assignedExams: string | undefined
) => {
  try {
    const res = await axiosInstance.post(`/student/update`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      _id: id,
      fname,
      lname,
      password,
      assignedExams: assignedExams?.split(',').map((examId) => ({
        examId: examId.trim(),
      })),
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


const deleteStudent = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/student/${id}`, {
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

const findStudent = async (param: string) => {
  try {
    const res = await axiosInstance.get(`/findStudent/${param}`, {
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
}

export { getAllStudents, createStudent, updateStudent, deleteStudent, findStudent };
