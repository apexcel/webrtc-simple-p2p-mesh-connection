import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { App } from './server';

export default (server: HttpServer, app: App) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    app.set('io', io);

    io.on('connect', socket => {
        socket.on('join', async ({ roomId, userName }) => {
            const sids = await io.in(roomId).allSockets().then(res => Array.from(res));
            if (!sids.length) {
                socket.join(roomId);
            }
            else {                
                const exceptIncomer = sids.filter(sid => sid !== socket.id);
                socket.join(roomId);
                socket.broadcast.emit('joined', socket.id);
                io.to(socket.id).emit('join', exceptIncomer);
            }
        })

        socket.on('ice-candidate', ({ receiver, data }) => {
            io.to(receiver).emit('ice-candidate', { sender: socket.id, data })
        })

        socket.on('offer', ({ receiver, data }) => {
            console.log('SERVER GOT OFFER => receiver:', receiver)
            io.to(receiver).emit('have-got-offer', { sender: socket.id, data })
        })

        socket.on('answer', ({ receiver, data }) => {
            console.log('SERVER GOT ANSWER => receiver:', receiver)
            io.to(receiver).emit('have-got-answer', { sender: socket.id, data })
        })
    });
};