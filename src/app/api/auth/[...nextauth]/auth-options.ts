// eslint-disable @typescript-eslint/no-unsafe-call -- temporary
import { type Admin } from '@/models/admin-models';
import { getAdmin } from '@/services/api/admin-api';
import NextAuth, { type NextAuthOptions } from 'next-auth';
// eslint-disable-next-line import/no-named-as-default -- t
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    // maxAge: 60 * 60,
  },

  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const admin: Admin = await getAdmin(email, password);

          if (admin) {
            return admin;
          }

          return null;
        } catch (e) {
          throw new Error((e as Error).message || 'Login Failed!');
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth/sign-in',
  },

  callbacks: {
    session: async ({ session, token }) => {
      session.user = token.user as Admin;

      return session;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
