/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import axiosInstance from "../axiosInstance";

const getExam = async (studentId: string, examId: string, token: string) => {
  try {
    const res = await axiosInstance.get(`/${studentId}/exam/${examId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = res.data;

    if (res.status >= 200 && res.status < 300 || data.err) {
      throw new Error(data.err || "Failed to get exam from server!");
    }

    return data;
  } catch (e) {
    throw e;
  }
};

const getAssignedExams = async (userId: string, token: string) => {
  try {
    const res = await axiosInstance.get(`/${userId}/assignedExams/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = res.data;

    if (res.status >= 200 && res.status < 300 || data.err) {
      throw new Error(data.err || "Failed to get assigned exams from server!");
    }

    return data.exams;
  } catch (e) {
    throw e;
  }
};

export { getExam, getAssignedExams };
