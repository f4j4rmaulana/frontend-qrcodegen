//import axios
import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: 'http://192.168.210.103:3001',
});

export default Api;
