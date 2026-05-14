import { useCallback } from 'react';
import api from '../api.js';

const useApi = (baseEndpoint = '') => {
  const get = useCallback(async (endpoint = '') => {
    const response = await api.get(baseEndpoint + endpoint);
    return response.data;
  }, [baseEndpoint]);

  const post = useCallback(async (endpoint = '', data) => {
    const response = await api.post(baseEndpoint + endpoint, data);
    return response.data;
  }, [baseEndpoint]);

  return { get, post };
};

export default useApi;
