import { io } from "socket.io-client";

const dev = 'ws://localhost:5000/';
const prod = 'ws://webrtc-simple-p2p-mesh.herokuapp.com/'

const url = prod;
const socket = io(url);

export default socket;