import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

//props to send the input from the search bar to parent component for filter 
interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <Box my={2}>
            <TextField
                fullWidth
                label="Search Deals by Name, Contact, or Company"
                variant="outlined"
                value={searchTerm}
                onChange={handleChange}
            />
        </Box>
    );
};

export default SearchBar;
