export interface Deal {
    id: number;
    name: string;
    contact_name: string;
    company: string;
    stage: 'New' | 'In Progress' | 'Won' | 'Lost';
    value: number;
    created_at: string;  // ISO date string
    close_date: string | null;
}
