'use client'

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useSession } from 'next-auth/react';
import { type Admin } from '@/models/admin-models';

interface ExamsFiltersProps {
  onSearch: (searchText: string, token: string | undefined) => void;
}

export function ExamsFilters({ onSearch }: ExamsFiltersProps): React.JSX.Element {
  const [searchText, setSearchText] = React.useState<string>('');
  const session = useSession();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    onSearch(event.target.value, (session.data?.user as Admin).token); // Call onSearch function with current search text
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchText}
        onChange={handleSearchChange}
        fullWidth
        placeholder="Search exams"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
