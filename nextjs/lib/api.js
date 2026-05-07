const API_URL = 'http://localhost:8000/api';

export async function fetchAPI(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? {'Authorization': `Bearer ${token}`} :{}),
        },
        ...options,
    } );

    return res;
}