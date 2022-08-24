import axios from "axios";

const api = () => {
    const post = (url: string, data: any) => {
        return axios.post(`http://localhost:3003/${url}`, data);
    }
    
    return { post }
}

export default api;