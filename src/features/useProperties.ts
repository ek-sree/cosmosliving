import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/constants';
import { getProperties, PropertyFilters } from '../services/apiProperty';

export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, filters],
    queryFn: () => getProperties(filters),
    keepPreviousData: true, 
    staleTime: 5 * 60 * 1000, 
  });
};