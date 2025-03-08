import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/constants';
import { getSingleProperty } from '../services/apiSingleProperty';



export const useSingleProperty = (propertyId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLEPROPERTY,propertyId],
    queryFn: () => getSingleProperty(propertyId),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};