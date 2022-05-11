import express from 'express';
import { createServer } from 'http';
import socket from './socket';
import path from 'path';
import routes from './routes';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../@types/Socket';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(routes);

const server = createServer(app);
// socket(server, app);

type Rooms = Map<string, Record<string, string>>

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

const rooms: Rooms = new Map();

io.on('connection', socket => {
    socket.on('join', ({ roomId, username }) => {
        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, { [socket.id]: username });
            return;
        }

        const users = rooms.get(roomId);
        rooms.set(roomId, {
            ...users,
            [socket.id]: username
        });
        socket.broadcast.emit('joined', { sid: socket.id, username });
        io.to(socket.id).emit('join', users!);
    })

    socket.on('ice-candidate', ({ receiver, data }) => {
        console.log('ice-candidate')
        io.to(receiver).emit('ice-candidate', { sender: socket.id, data })
    })

    socket.on('offer', ({ receiver, data }) => {
        console.log('got-offer', receiver, data)
        io.to(receiver).emit('got-offer', { sender: socket.id, data })
    })

    socket.on('answer', ({ receiver, data }) => {
        console.log('got-anwser')
        io.to(receiver).emit('got-answer', { sender: socket.id, data })
    })

    socket.on('message', message => {
        io.to(message.roomId).except(socket.id).emit('got-message', message);
    })

    socket.on('disconnect', (reason) => {
        rooms.forEach((room) => {
            if (room[socket.id]) {
                delete room[socket.id];
            }
        })
        socket.broadcast.emit('user-exited', socket.id);
        console.log('disconnected', reason, socket.id);
    })
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});

export type App = typeof app;