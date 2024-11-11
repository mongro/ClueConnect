"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const LobbyDB_1 = __importDefault(require("./LobbyDB"));
const SocketController_1 = require("./SocketController");
const router_1 = __importDefault(require("./router"));
/**
 * Express Server
 */
var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 5000;
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(router_1.default);
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
app.post('/createLobby', (req, res) => {
    res.send('POST request to the homepage');
});
const io = new socket_io_1.Server(server, {
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
        const lobby = LobbyDB_1.default.get(id);
        if (!lobby)
            return;
        if (!lobby.hasPlayer(credentials))
            return;
        const controller = new SocketController_1.SocketController(socket, io, lobby, credentials);
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