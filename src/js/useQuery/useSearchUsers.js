import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useSearchUser = (keySearch) => useQuery(['list users', keySearch], async () => {
  const res = await api.get('/users', {
    params: {
      keySearch,
      sortBy: 'id',
      sortType: 'desc',
      limit: 7,
      offset: 0,
    },
  });
  return res.data;
});

export default useSearchUser;
