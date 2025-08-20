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
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const fetchDeals = async (pageNumber: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDeals({
                search: searchTerm,
                stage: filters.stage,
                minValue: filters.minValue,
                maxValue: filters.maxValue,
                dateCreatedFrom: filters.dateCreatedFrom,
                dateCreatedTo: filters.dateCreatedTo,
                closeDateFrom: filters.closeDateFrom,
                closeDateTo: filters.closeDateTo,
                page: pageNumber,
                limit: pageSize,
            });

            setDeals(data.data);
            setHasMore(data.data.length === pageSize);
        } catch (error) {
            setError('Failed to load deals.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchDeals(1);
    }, [searchTerm, filters, pageSize]);

    // Only fetch data when page changes (but not when filters change)
    useEffect(() => {
        if (page > 1) {
            fetchDeals(page);
        }
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (hasMore) setPage(page + 1);
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

    if (deals.length === 0) {
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
                        {deals.map((deal) => (
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
                    Page {page}
                </Typography>
                <Button variant="contained" onClick={handleNext} disabled={!hasMore}>
                    Next
                </Button>
            </Stack>
        </>
    );
};

export default DealsList;
