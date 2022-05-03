import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const requestCreateNewRoom = async () => {
    try {
        const res = await axios.get('/createNewRoom');
        if (res) {
            return res.data;
        }
    }
    catch (err) {
        console.error(err);
    }
}