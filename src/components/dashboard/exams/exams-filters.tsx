import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface ExamsFiltersProps {
  onSearch: (searchText: string) => void;
}

export function ExamsFilters({ onSearch }: ExamsFiltersProps): React.JSX.Element {
  const [searchText, setSearchText] = React.useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    onSearch(event.target.value); // Call onSearch function with current search text
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchText}
        onChange={handleSearchChange}
        defaultValue=""
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
