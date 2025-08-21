import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchBar from './components/SearchBar';
import FiltersPanel from './components/FiltersPanel';
import DealsList from './components/DealsList';

interface Filters {
  stage: string;
  minValue: string;
  maxValue: string;
  dateCreatedFrom: string;
  dateCreatedTo: string;
  closeDateFrom: string;
  closeDateTo: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    stage: '',
    minValue: '',
    maxValue: '',
    dateCreatedFrom: '',
    dateCreatedTo: '',
    closeDateFrom: '',
    closeDateTo: '',
  });

  const handleSearch = (term: string) => {
    console.log(term);
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Deals CRM
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <FiltersPanel onFilterChange={handleFilterChange} />
      <DealsList searchTerm={searchTerm} filters={filters} />
    </Container>
  );
}

export default App;
