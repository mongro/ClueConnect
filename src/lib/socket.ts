import type { ClientToServerEvents, ServerToClientEvents } from '$shared/src/types';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { io, Socket } from 'socket.io-client';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(PUBLIC_SERVER_URL, {
	autoConnect: false
});
console.log('socket');
export default socket;
