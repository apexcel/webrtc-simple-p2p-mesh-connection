import { io } from "socket.io-client";

const url = 'ws://localhost:5000/';
const socket = io(url);

export default socket;