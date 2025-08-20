import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Filters {
    stage: string;
    minValue: string;
    maxValue: string;
    dateCreatedFrom: string;
    dateCreatedTo: string;
    closeDateFrom: string;
    closeDateTo: string;
}

interface FiltersPanelProps {
    onFilterChange: (filters: Filters) => void;
}

const dealStages = ['New', 'In Progress', 'Won', 'Lost'];

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        stage: '',
        minValue: '',
        maxValue: '',
        dateCreatedFrom: '',
        dateCreatedTo: '',
        closeDateFrom: '',
        closeDateTo: '',
    });

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Notify parent on filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const clearFilters = () => {
        setFilters({
            stage: '',
            minValue: '',
            maxValue: '',
            dateCreatedFrom: '',
            dateCreatedTo: '',
            closeDateFrom: '',
            closeDateTo: '',
        });
    };

    return (
        <Box my={2}>
            <Button variant="outlined" onClick={toggleOpen}>
                {isOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Box mt={2} p={2} border={1} borderRadius={2} borderColor="grey.300">
                            <Stack spacing={2}>
                                <TextField
                                    select
                                    label="Deal Stage"
                                    name="stage"
                                    value={filters.stage}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {dealStages.map((stage) => (
                                        <MenuItem key={stage} value={stage}>
                                            {stage}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Min Value"
                                        name="minValue"
                                        type="number"
                                        value={filters.minValue}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Max Value"
                                        name="maxValue"
                                        type="number"
                                        value={filters.maxValue}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Stack>

                                <Typography variant="subtitle1">Date Created Range</Typography>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="From"
                                        name="dateCreatedFrom"
                                        type="date"
                                        value={filters.dateCreatedFrom}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="To"
                                        name="dateCreatedTo"
                                        type="date"
                                        value={filters.dateCreatedTo}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Stack>

                                <Typography variant="subtitle1">Close Date Range</Typography>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="From"
                                        name="closeDateFrom"
                                        type="date"
                                        value={filters.closeDateFrom}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="To"
                                        name="closeDateTo"
                                        type="date"
                                        value={filters.closeDateTo}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Stack>

                                <Button variant="text" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </Stack>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default FiltersPanel;
