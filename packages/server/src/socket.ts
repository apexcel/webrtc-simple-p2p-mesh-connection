import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { App } from './server';

type Rooms = Map<string, Record<string, string>>

export default (server: HttpServer, app: App) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    const rooms: Rooms = new Map();

    app.set('io', io);

    io.on('connection', socket => {
        console.log('user connected')
        socket.on('join', ({ roomId, username }) => {
            socket.join(roomId);

            if (!rooms.has(roomId)) {
                rooms.set(roomId, { [socket.id]: username });
            }
            else {
                const users = rooms.get(roomId);
                rooms.set(roomId, {
                    ...users,
                    [socket.id]: username
                });
                socket.broadcast.emit('joined', { sid: socket.id, username });
                io.to(socket.id).emit('join', users);
            }
        })

        socket.on('ice-candidate', ({ receiver, data }) => {
            console.log('ice-candidate')
            io.to(receiver).emit('ice-candidate', { sender: socket.id, data })
        })

        socket.on('offer', ({ receiver, data }) => {
            console.log('have-got-offer')
            io.to(receiver).emit('have-got-offer', { sender: socket.id, data })
        })

        socket.on('answer', ({ receiver, data }) => {
            console.log('have-got-anwser')
            io.to(receiver).emit('have-got-answer', { sender: socket.id, data })
        })

        // socket.on('user-exit', ({ sid, roomId }: { sid: string, roomId: string }) => {
        //     socket.leave(roomId);
        //     const room = rooms.get(roomId)!;
        //     delete room[sid];
        //     socket.broadcast.emit('have-got-user-exit', socket.id);
        // })
        
        socket.on('disconnect', (reason) => {
            rooms.forEach(room => {
                if (room[socket.id]) delete room[socket.id];
            })
            console.log('disconnected', reason, socket.id);
            io.emit('user-exited', socket.id);
        })
    });
};