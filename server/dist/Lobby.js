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
    player = {};
    playerLimit = 10;
    isLocked = false;
    IdForNewPlayer = 1;
    constructor(id) {
        this.id = id;
        this.game = new Game_1.Game(1, this.player);
    }
    get isFull() {
        return this.isLocked || this.playerLimit < Object.keys(this.player).length - 1;
    }
    hasPlayer(credentials) {
        return this.player[credentials] !== undefined;
    }
    addPlayer(name) {
        if (this.isFull)
            return undefined;
        const credentials = crypto_1.default.randomUUID();
        const playerNew = {
            id: this.IdForNewPlayer++,
            name: name,
            isConnected: true,
            isHost: Object.keys(this.player).length === 0
        };
        this.player[credentials] = playerNew;
        return credentials;
    }
    getOrAddPlayer(credentials, name) {
        if (this.isFull)
            return { success: false, isNew: false };
        if (this.player[credentials] !== undefined) {
            return { success: true, isNew: false, player: this.player[credentials] };
        }
        const playerNew = {
            id: this.IdForNewPlayer++,
            name: name ?? 'Unknown',
            isConnected: true,
            isHost: Object.keys(this.player).length === 0
        };
        this.player[credentials] = playerNew;
        return { success: true, isNew: true, player: playerNew };
    }
}
exports.Lobby = Lobby;
