import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types';
import lobbyDb from './LobbyDB';
import { SocketController } from './SocketController';
import router from './router';

console.log(process.env); /**
 * Express Server
 */

const app = express();
var corsOptions = {
	origin: process.env.CLIENT_URL,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const PORT = process.env.PORT ?? 5000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
	console.log(`ClientUrl ${process.env.CLIENT_URL}`);
});

app.post('/createLobby', (req, res) => {
	res.send('POST request to the homepage');
});

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ['GET', 'POST']
	}
});

/**
 * Socket IO Event Handling
 */
io.on('connection', (socket) => {
	socket.on('joinLobby', (id, credentials) => {
		const lobby = lobbyDb.get(id);
		if (!lobby) return;

		if (!lobby.hasPlayer(credentials)) return;

		const controller = new SocketController(socket, io, lobby, credentials);
		controller.sync();

		//socket.on('sync', (team, role) => controller.startGame());
		socket.on('joinTeamAndRole', (team, role) => controller.joinTeamAndRole(team, role));
		socket.on('startGame', () => controller.startGame());
		socket.on('resetGame', () => controller.resetGame());
		socket.on('giveClue', (word, number) => controller.giveClue(word, number));
		socket.on('makeGuess', (cardId) => controller.makeGuess(cardId));
		socket.on('endGuessing', () => controller.endGuessing());
		socket.on('disconnect', () => controller.handleDisconnect());
	});
});
