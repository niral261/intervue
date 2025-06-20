import express from 'express';
import Connection from './database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes/route.js';
import ChatRoutes from './routes/chat.js';
import { createServer } from 'http';
import { Server} from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
app.use('/poll', Routes);
app.use('/chat', ChatRoutes);

io.on(
    'connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('newPoll', (poll) => {
            socket.broadcast.emit('pollStarted', poll);
        });

        socket.on('answerSubmitted', (poll) => {
            socket.broadcast.emit('pollUpdated', poll);
        });

        socket.on('endPoll', (poll) => {
            socket.broadcast.emit('pollEnded', poll);
        });

        socket.on('kickStudent', (studentId) => {
            socket.broadcast.emit('studentKicked', studentId);
        });

        socket.on('newChatMessage', (message) => {
            socket.broadcast.emit('chatMessage', message);
        });

        socket.on('disconnect', (poll) => {
            console.log('User disconnected:', socket.id);
        });
    }
);


const PORT = process.env.PORT || 8000; 
httpServer.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
});

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const URL = process.env.MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.dwhb53c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`;
Connection(URL);


export default app;

