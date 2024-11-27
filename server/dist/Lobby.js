"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const Game_1 = require("./Game");
const crypto_1 = __importDefault(require("crypto"));
class Lobby {
    id;
    game;
    players = {};
    credentialsToIdMap = {};
    playerLimit = 10;
    isLocked = false;
    IdForNewPlayer = 0;
    constructor(id) {
        this.id = id;
        this.game = new Game_1.Game(1, this.players);
    }
    get isFull() {
        return this.isLocked || this.playerLimit < Object.keys(this.players).length - 1;
    }
    hasPlayer(id) {
        return this.players[id] !== undefined;
    }
    get playersAll() {
        return Object.values(this.players);
    }
    getPlayerFromCredentials(credentials) {
        const id = this.credentialsToIdMap[credentials];
        if (id === undefined)
            return null;
        return this.players[id];
    }
    get host() {
        return Object.values(this.players).find((player) => player.isHost);
    }
    setHost(id) {
        const player = this.players[id];
        const currentHost = this.host;
        if (currentHost)
            currentHost.isHost = false;
        if (player) {
            this.players[id].isHost = true;
            return { success: true };
        }
        else
            return { success: false };
    }
    kickPlayer(id) {
        if (this.players[id]) {
            delete this.players[id];
            return { success: true };
        }
        return { success: false };
    }
    addPlayer(name) {
        if (this.isFull)
            return undefined;
        const credentials = crypto_1.default.randomUUID();
        const playerNew = {
            id: this.IdForNewPlayer++,
            name: name,
            isConnected: true,
            isHost: Object.keys(this.players).length === 0
        };
        this.players[playerNew.id] = playerNew;
        this.credentialsToIdMap[credentials] = playerNew.id;
        return credentials;
    }
}
exports.Lobby = Lobby;
