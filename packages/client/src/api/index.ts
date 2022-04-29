import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

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