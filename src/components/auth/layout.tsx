import * as React from 'react';
import Box from '@mui/material/Box';

import { Logo } from '@/components/core/logo';
import { Typography } from '@mui/material';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', p: 3 }}>
            <Logo color="light" src='/assets/logo.png' height={40} width={40} />
            <Typography color="black" sx={{ fontSize: '1rem' }}>
              Auto-Proctoring Exam CMS
            </Typography>
          </Box>

        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
