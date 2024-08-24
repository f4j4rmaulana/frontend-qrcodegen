//import axios
import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: import.meta.env.VITE_API_URL,
});

export default Api;
