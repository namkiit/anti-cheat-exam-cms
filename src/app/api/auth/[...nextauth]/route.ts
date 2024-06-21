import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"; // Adjust the path as needed

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- temporary
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };