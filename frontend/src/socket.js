import { io } from 'socket.io-client';
import { SOCKET_URL } from './api.js';

export const socket = io(`${SOCKET_URL}`, {transports: ['websocket']});