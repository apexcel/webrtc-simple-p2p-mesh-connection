import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../@types/Socket";

const url = process.env.REACT_APP_SOCKET_URL!;
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url);

export default socket;