
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../components/common/redux/slices/authSlice';

const baseURL = 'http://localhost:8080/api';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

const useAxios = ({ url, method, body = null, headers = null, withCredentials = false }) => {
    const token = useSelector(selectCurrentToken);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        if (token) headers = JSON.stringify({...headers, Authorization: `Bearer ${token}`})
        axiosInstance[method](url, JSON.parse(headers), JSON.parse(body), withCredentials)
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [method, url, body, headers]);

    return { response, error, isLoading };
};

export default useAxios