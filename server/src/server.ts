import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
import { ClientToServerEvents, GameOptions, ServerToClientEvents } from './types';
import lobbyDb from './LobbyDB';
import { SocketController } from './SocketController';
import router from './router';

const app = express();
const corsOptions = {
	origin: process.env.CLIENT_URL,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const PORT = process.env.PORT ?? 5000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

const server = app.listen(PORT, () => {});

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
		const player = lobby.getPlayerFromCredentials(credentials);
		if (!player) return;

		const controller = new SocketController(socket, io, lobby, player);
		controller.sync();

		socket.on('joinTeamAndRole', (team, role) => controller.joinTeamAndRole(team, role));
		socket.on('addBot', (team, role) => controller.addBot({ team, role, type: 'gemini' }));
		socket.on('deleteBot', (team, role) => controller.deleteBot(role, team));
		socket.on('startGame', (options?: Partial<GameOptions>) => controller.startGame(options));
		socket.on('resetGame', () => controller.resetGame());
		socket.on('resetTeams', () => controller.resetTeams());
		socket.on('kickPlayer', (id: number) => controller.kickPlayer(id));
		socket.on('makeHost', (id: number) => controller.makeHost(id));
		socket.on('giveClue', (word, number) => controller.giveClue(word, number));
		socket.on('makeGuess', (cardId) => controller.makeGuess(cardId));
		socket.on('toggleSuggestion', (cardId) => controller.toggleSuggestion(cardId));
		socket.on('endGuessing', () => controller.endGuessing());
		socket.on('disconnect', () => controller.handleDisconnect());
	});
});
