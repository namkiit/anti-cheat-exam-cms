/* eslint-disable eslint-comments/require-description -- disable comments description */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import axiosInstance from '../axiosInstance';
import { type Admin } from "../../models/admin-models";

const getAdmin = async (email: string, password: string): Promise<Admin> => {
  try {
    const res = await axiosInstance.post(`/loginAdmin`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        email,
        password
      });

    const data: any = res.data;

    return data;
  } catch (e) {
    throw new Error((e as Error).message || 'Failed to signin user!');
  }
};

export { getAdmin };
