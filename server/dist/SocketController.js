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
    player;
    constructor(socket, io, lobby, player) {
        this.socket = socket;
        this.io = io;
        this.lobby = lobby;
        this.player = player;
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
    sendToSingleClient(id, event, ...data) {
        this.io.to(this.getLobbyChannel() + id).emit(event, ...data);
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
        const playerGroup = this.lobby.players;
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
        this.sendToAll('suggestionsUpdate', this.getGame().getState('operative').suggestions);
    }
    sendPlayerState() {
        this.sendToAll('playerUpdate', this.getAllPlayer());
    }
    sendMyPlayerStatus() {
        this.sendToMe('myStatus', this.player);
    }
    // PUBLIC METHODS
    sync() {
        if (this.player.role === 'spymaster') {
            this.socket.join(this.getSpyMasterChannel());
            this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
        }
        this.socket.join(this.getLobbyChannel());
        this.socket.join(this.getLobbyChannel() + this.player.id);
        this.player.isConnected = true;
        this.sendGameState();
        this.sendPlayerState();
        this.sendMyPlayerStatus();
    }
    joinTeamAndRole(team, role) {
        const { success } = this.getGame().setPlayerRole(this.player, role, team);
        if (success) {
            if (role === 'spymaster') {
                this.socket.join(this.getSpyMasterChannel());
                this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
            }
            else {
                this.socket.leave(this.getSpyMasterChannel());
            }
            this.sendPlayerState();
        }
    }
    makeGuess(id) {
        const { success } = this.getGame().makeGuess(this.player, id);
        if (success)
            this.sendGameState();
    }
    toggleSuggestion(id) {
        const { success } = this.getGame().toggleSuggestion(this.player, id);
        if (success)
            this.sendSuggestions();
    }
    endGuessing() {
        const { success } = this.getGame().endGuessing(this.player);
        if (success)
            this.sendGameState();
    }
    kickPlayer(id) {
        if (!this.player.isHost)
            return;
        const { success } = this.lobby.kickPlayer(id);
        if (success) {
            this.sendToSingleClient(id, 'kick');
            this.sendPlayerState();
        }
    }
    makeHost(id) {
        if (!this.player.isHost)
            return;
        const { success } = this.lobby.setHost(id);
        if (success) {
            this.sendPlayerState();
        }
    }
    giveClue(word, number) {
        console.log('memory', process.memoryUsage());
        const { success } = this.getGame().giveClue(this.player, { clue: word, number });
        if (success)
            this.sendGameState();
    }
    startGame() { }
    handleDisconnect() {
        this.player.isConnected = false;
        this.sendPlayerState();
    }
    resetGame() {
        if (!this.player.isHost)
            return;
        this.sendGameState();
    }
}
exports.SocketController = SocketController;
