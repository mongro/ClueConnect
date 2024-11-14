import type { ClientToServerEvents, ServerToClientEvents } from '$shared/src/types';
import { io, Socket } from 'socket.io-client';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:5000');
console.log('socket');
export default socket;
