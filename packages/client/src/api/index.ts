import axios from 'axios';

const dev = 'http://localhost:5000';
const prod = 'https://webrtc-simple-p2p-mesh.herokuapp.com/';

axios.defaults.baseURL = prod;

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