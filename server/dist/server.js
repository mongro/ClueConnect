"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const socket_io_1 = require("socket.io");
const LobbyDB_1 = __importDefault(require("./LobbyDB"));
const SocketController_1 = require("./SocketController");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
var corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const PORT = process.env.PORT ?? 5000;
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(router_1.default);
const server = app.listen(PORT, () => { });
app.post('/createLobby', (req, res) => {
    res.send('POST request to the homepage');
});
const io = new socket_io_1.Server(server, {
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
        const lobby = LobbyDB_1.default.get(id);
        if (!lobby)
            return;
        const player = lobby.getPlayerFromCredentials(credentials);
        if (!player)
            return;
        const controller = new SocketController_1.SocketController(socket, io, lobby, player);
        controller.sync();
        socket.on('joinTeamAndRole', (team, role) => controller.joinTeamAndRole(team, role));
        socket.on('startGame', (options) => controller.startGame(options));
        socket.on('resetGame', () => controller.resetGame());
        socket.on('resetTeams', () => controller.resetTeams());
        socket.on('kickPlayer', (id) => controller.kickPlayer(id));
        socket.on('makeHost', (id) => controller.makeHost(id));
        socket.on('giveClue', (word, number) => controller.giveClue(word, number));
        socket.on('makeGuess', (cardId) => controller.makeGuess(cardId));
        socket.on('toggleSuggestion', (cardId) => controller.toggleSuggestion(cardId));
        socket.on('endGuessing', () => controller.endGuessing());
        socket.on('disconnect', () => controller.handleDisconnect());
    });
});
