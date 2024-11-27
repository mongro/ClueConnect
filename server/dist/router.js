"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LobbyDB_1 = __importDefault(require("./LobbyDB"));
const express_1 = require("express");
const Lobby_1 = require("./Lobby");
const router = (0, express_1.Router)();
const getGame = (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const lobby = LobbyDB_1.default.get(id);
        console.log('players', lobby?.playersAll);
        if (!lobby) {
            res.status(404).json({ message: 'Lobby not found' });
            return;
        }
        res.status(200).json({ game: lobby.game, players: lobby.playersAll });
    }
    catch (error) {
        console.error('Error in createLobby:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const createLobby = (req, res) => {
    try {
        const { name } = req.body;
        let id = Math.random().toString(36).slice(-6);
        let attempts = 0;
        while (LobbyDB_1.default.get(id) && attempts < 15) {
            id = Math.random().toString(36).slice(-6);
            attempts++;
        }
        if (attempts === 15) {
            res.status(200).json({ success: false });
            return;
        }
        const lobby = new Lobby_1.Lobby(id);
        const credentials = lobby.addPlayer(name);
        if (credentials) {
            LobbyDB_1.default.add(id, lobby);
            res.status(200).json({ success: true, credentials, lobbyId: id });
            return;
        }
        res.status(200).json({ success: false });
    }
    catch (error) {
        console.error('Error in createLobby:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const joinLobby = (req, res) => {
    try {
        const { name, lobbyId } = req.body;
        const lobby = LobbyDB_1.default.get(lobbyId);
        if (!lobby) {
            res
                .status(200)
                .json({ success: false, message: 'Lobby doesnt exist', lobby: LobbyDB_1.default.keys, key: lobbyId });
            return;
        }
        const credentials = lobby.addPlayer(name);
        if (credentials) {
            res.status(200).json({ success: true, credentials, lobbyId });
            return;
        }
        res.status(200).json({ success: false, message: 'Not allowed to join lobby.' });
    }
    catch (error) {
        console.error('Error in joinLobby:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
router.post('/createLobby', createLobby);
router.post('/joinLobby', joinLobby);
router.get('/getGame/:id', getGame);
exports.default = router;
