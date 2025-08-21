import axios from 'axios';
import type { Deal } from '../types/deal';

interface GetDealsParams {
    search?: string;
    stage?: string;
    minValue?: string;
    maxValue?: string;
    dateCreatedFrom?: string;
    dateCreatedTo?: string;
    closeDateFrom?: string;
    closeDateTo?: string;
    page?: number;
    limit?: number;
}

interface GetDealsResponse {
    page: number;
    limit: number;
    data: Deal[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDeals = async (params: GetDealsParams): Promise<GetDealsResponse> => {
    const { data } = await axios.get<GetDealsResponse>(`${API_BASE_URL}/deals`, {
        params,
    });
    return data;
};
