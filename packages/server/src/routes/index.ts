import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import path from 'path';

const router = Router();

router.get('/createNewRoom', (req, res) => {
    res.send(uuidv4());
});

router.get('/:roomId', (req, res, next) => {
    next();
})

router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/index.html'));
})

export default router;