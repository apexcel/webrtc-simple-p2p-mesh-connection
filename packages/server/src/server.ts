import express from 'express';
import { createServer } from 'http';
import socket from './socket';
import path from 'path';
import routes from './routes';

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
socket(server, app);

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));


export type App = typeof app;