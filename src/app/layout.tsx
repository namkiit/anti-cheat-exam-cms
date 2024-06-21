import * as React from 'react';
import type { Viewport } from 'next';
import type { Session } from 'next-auth';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { UserSessionProvider } from '@/components/providers/session-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
  pageProps: {
    session: Session;
  };
}

export default function Layout({ children, pageProps }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <UserSessionProvider session={pageProps?.session}>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
        </UserSessionProvider>
      </body>
    </html>
  );
}