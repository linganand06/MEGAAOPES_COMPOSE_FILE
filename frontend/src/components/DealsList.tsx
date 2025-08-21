import React, { useEffect, useState } from 'react';
import type { Deal } from '../types/deal';
import { getDeals } from '../api/dealsApi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Box,
    Button,
    Stack,
} from '@mui/material';

interface DealsListProps {
    searchTerm: string;
    filters: {
        stage: string;
        minValue: string;
        maxValue: string;
        dateCreatedFrom: string;
        dateCreatedTo: string;
        closeDateFrom: string;
        closeDateTo: string;
    };
    pageSize?: number;
}

const DealsList: React.FC<DealsListProps> = ({
    searchTerm,
    filters,
    pageSize = 10,
}) => {
    const [allDeals, setAllDeals] = useState<Deal[]>([]);
    const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const fetchAllDeals = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all deals without pagination or filters from the backend
                const data = await getDeals({});
                setAllDeals(data.data);
                setFilteredDeals(data.data);
            } catch (error) {
                setError('Failed to load deals.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllDeals();
    }, []);

    useEffect(() => {
        let deals = [...allDeals];

        // Apply search term filter
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            deals = deals.filter(
                (deal) =>
                    deal.name.toLowerCase().includes(lowercasedTerm) ||
                    deal.contact_name.toLowerCase().includes(lowercasedTerm) ||
                    deal.company.toLowerCase().includes(lowercasedTerm)
            );
        }

        // Apply filters
        deals = deals.filter((deal) => {
            if (filters.stage && deal.stage !== filters.stage) {
                return false;
            }
            if (filters.minValue && deal.value < parseFloat(filters.minValue)) {
                return false;
            }
            if (filters.maxValue && deal.value > parseFloat(filters.maxValue)) {
                return false;
            }
            if (filters.dateCreatedFrom && new Date(deal.created_at) < new Date(filters.dateCreatedFrom)) {
                return false;
            }
            if (filters.dateCreatedTo && new Date(deal.created_at) > new Date(filters.dateCreatedTo)) {
                return false;
            }
            if (filters.closeDateFrom && deal.close_date && new Date(deal.close_date) < new Date(filters.closeDateFrom)) {
                return false;
            }
            if (filters.closeDateTo && deal.close_date && new Date(deal.close_date) > new Date(filters.closeDateTo)) {
                return false;
            }
            return true;
        });

        setFilteredDeals(deals);
        setPage(1); // Reset to first page on new filter
    }, [searchTerm, filters, allDeals]);

    const totalPages = Math.ceil(filteredDeals.length / pageSize);
    const paginatedDeals = filteredDeals.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handlePrev = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    if (loading) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography mt={4} color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (paginatedDeals.length === 0) {
        return (
            <Typography mt={4} align="center">
                No deals found.
            </Typography>
        );
    }

    return (
        <>
            <Paper sx={{ mt: 4, overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Deal Name</TableCell>
                            <TableCell>Contact Name</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Stage</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Close Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedDeals.map((deal) => (
                            <TableRow
                                key={deal.id}
                                sx={{
                                    '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' },
                                }}
                            >
                                <TableCell>{deal.name}</TableCell>
                                <TableCell>{deal.contact_name}</TableCell>
                                <TableCell>{deal.company}</TableCell>
                                <TableCell>{deal.stage}</TableCell>
                                <TableCell>${deal.value.toLocaleString()}</TableCell>
                                <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {deal.close_date ? new Date(deal.close_date).toLocaleDateString() : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
                <Button variant="contained" onClick={handlePrev} disabled={page === 1}>
                    Previous
                </Button>
                <Typography variant="body1" align="center" sx={{ alignSelf: 'center' }}>
                    Page {page} of {totalPages}
                </Typography>
                <Button variant="contained" onClick={handleNext} disabled={page === totalPages || totalPages === 0}>
                    Next
                </Button>
            </Stack>
        </>
    );
};

export default DealsList;
