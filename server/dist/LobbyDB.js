"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lobby_1 = require("./Lobby");
class LobbyDB {
    lobbys = {};
    getOrCreateById(id) {
        if (this.has(id))
            return this.get(id);
        const lobbyNew = new Lobby_1.Lobby(id);
        this.add(id, lobbyNew);
        return lobbyNew;
    }
    add(id, item) {
        this.lobbys[id] = item;
    }
    get(id) {
        return this.lobbys[id];
    }
    remove(id) {
        delete this.lobbys[id];
    }
    has(id) {
        return this.lobbys[id] !== undefined;
    }
    clear() {
        this.lobbys = {};
    }
    get keys() {
        return Object.keys(this.lobbys);
    }
    get items() {
        return Object.values(this.lobbys);
    }
    get size() {
        return this.keys.length;
    }
}
const db = new LobbyDB();
exports.default = db;
