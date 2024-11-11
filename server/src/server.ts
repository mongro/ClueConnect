import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types';
import lobbyDb from './LobbyDB';
import { SocketController } from './SocketController';
import router from './router';

/**
 * Express Server
 */

var corsOptions = {
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

app.post('/createLobby', (req, res) => {
	res.send('POST request to the homepage');
});

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(server, {
	cors: {
		origin: 'http://localhost:5173',
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
