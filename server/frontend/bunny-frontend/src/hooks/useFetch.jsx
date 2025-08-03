import React,{use, useState, useEffect} from 'react'

function useFetch(url, dependency = [], payload = null, method = 'GET') {
    const [data, setData] = useState([]);

    useEffect(()=>{
        fetch(url,{
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: payload ? JSON.stringify(payload) : null
        })
            .then((res)=>res.json())
            .then((data)=>{
                setData(data);
            })
    }, dependency)

    return  data
}

export default useFetch;