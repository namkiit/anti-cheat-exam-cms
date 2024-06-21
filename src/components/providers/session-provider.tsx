'use client'

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';


export function UserSessionProvider({ children, session }: { children: React.ReactNode, session: Session }): React.ReactNode {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}