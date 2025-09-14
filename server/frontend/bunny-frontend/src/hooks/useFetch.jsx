import React,{use, useState, useEffect} from 'react'

function useFetch(url, dependency = [], payload = null, method = 'GET') {
    const [data, setData] = useState([]);

    useEffect(() => {
            const token = localStorage.getItem('access_token');
           
            fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: payload ? JSON.stringify(payload) : null
            })
            .then((res) => {
                if (!res.ok) {
                    // Handle HTTP errors (401, 403, etc.)
                    if (res.status === 401) {
                        // Token expired or invalid
                        localStorage.removeItem('access_token');
                        // Optionally redirect to login
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setData([])
                // Handle error state if needed
            });
        }, dependency);

    return  data
}

export default useFetch;