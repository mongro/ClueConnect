"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = void 0;
const SPYMASTER_CHANNEL = '/spymasters';
const OPERATIVE_CHANNEL = '/operatives';
/**
 * This class is responsible for handling all events for a given socket.
 * It connects the server with the methods in Game class.
 */
class SocketController {
    socket;
    io;
    lobby;
    credentials;
    constructor(socket, io, lobby, credentials) {
        this.socket = socket;
        this.io = io;
        this.lobby = lobby;
        this.credentials = credentials;
    }
    // AUXILIARY PRIVATE METHODS
    getLobbyChannel() {
        return this.lobby.id;
    }
    getSpyMasterChannel() {
        return this.lobby.id + SPYMASTER_CHANNEL;
    }
    sendToAll(event, ...data) {
        this.io.to(this.getLobbyChannel()).emit(event, ...data);
    }
    sendToMe(event, ...data) {
        this.socket.emit(event, ...data);
    }
    sendToOthers(event, ...data) {
        this.socket.broadcast.to(this.getLobbyChannel()).emit(event, ...data);
    }
    sendToSpyMasters(event, ...data) {
        this.io.to(this.getSpyMasterChannel()).emit(event, ...data);
    }
    sendToOperatives(event, ...data) {
        this.io.to(this.getLobbyChannel()).emit(event, ...data);
    }
    getAllPlayer() {
        const playerGroup = this.lobby.player;
        return Object.values(playerGroup);
    }
    // PRIVATE METHODS
    getGame() {
        return this.lobby.game;
    }
    sendGameState() {
        this.sendToAll('gameUpdate', this.getGame().getState('operative'));
        this.sendToSpyMasters('gameUpdate', this.getGame().getState('spymaster'));
    }
    sendSuggestions() {
        this.sendToAll('suggestionsUpdate', this.getGame().getSuggestions());
    }
    sendPlayerState() {
        this.sendToAll('playerUpdate', this.getAllPlayer());
    }
    sendMyPlayerStatus() {
        this.sendToMe('myStatus', this.lobby.player[this.credentials]);
    }
    // PUBLIC METHODS
    sync() {
        let player = this.lobby.player[this.credentials];
        if (player.role === 'spymaster') {
            this.socket.join(this.getSpyMasterChannel());
            this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
        }
        this.socket.join(this.getLobbyChannel());
        this.lobby.player[this.credentials] = {
            ...player,
            isConnected: true
        };
        this.sendGameState();
        this.sendPlayerState();
        this.sendMyPlayerStatus();
    }
    joinTeamAndRole(team, role) {
        const { success } = this.getGame().setPlayerRole(this.credentials, role, team);
        if (success) {
            if (role === 'spymaster') {
                this.socket.join(this.getSpyMasterChannel());
                this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
            }
            else {
                this.socket.leave(this.getSpyMasterChannel());
            }
            this.sendPlayerState();
            this.sendMyPlayerStatus();
        }
    }
    makeGuess(id) {
        const { success } = this.getGame().makeGuess(this.credentials, id);
        if (success)
            this.sendGameState();
    }
    toggleSuggestion(id) {
        const { success } = this.getGame().toggleSuggestion(this.credentials, id);
        if (success)
            this.sendSuggestions();
    }
    endGuessing() {
        const { success } = this.getGame().endGuessing(this.credentials);
        if (success)
            this.sendGameState();
    }
    giveClue(word, number) {
        const { success } = this.getGame().giveClue(this.credentials, { clue: word, number });
        if (success)
            this.sendGameState();
    }
    startGame() { }
    handleDisconnect() {
        this.lobby.player[this.credentials] = {
            ...this.lobby.player[this.credentials],
            isConnected: false
        };
        this.sendPlayerState();
    }
    resetGame() {
        if (!this.lobby.player[this.credentials].isHost)
            return;
        this.sendGameState();
    }
}
exports.SocketController = SocketController;
