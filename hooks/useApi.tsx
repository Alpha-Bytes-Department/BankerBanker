import { useState } from "react";


const useApi = (endpoint: string, ) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const fetchData = async () =>{
        try {
            
        } catch (error) {
            console.log(error);
        }
    }

    return {};
};

export default useApi;