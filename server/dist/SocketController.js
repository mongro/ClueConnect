"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = void 0;
const SPYMASTER_CHANNEL_KEYWORD = '/spymasters';
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
    get lobbyChannel() {
        return this.lobby.id;
    }
    get isHost() {
        return this.player.isHost;
    }
    get spymasterChannel() {
        return this.lobby.id + SPYMASTER_CHANNEL_KEYWORD;
    }
    sendToAll(event, ...data) {
        this.io.to(this.lobbyChannel).emit(event, ...data);
    }
    sendToMe(event, ...data) {
        this.socket.emit(event, ...data);
    }
    sendToSingleClient(id, event, ...data) {
        this.io.to(this.lobbyChannel + id).emit(event, ...data);
    }
    sendToOthers(event, ...data) {
        this.socket.broadcast.to(this.lobbyChannel).emit(event, ...data);
    }
    sendToSpyMasters(event, ...data) {
        this.io.to(this.spymasterChannel).emit(event, ...data);
    }
    sendToOperatives(event, ...data) {
        this.io.to(this.lobbyChannel).emit(event, ...data);
    }
    getAllPlayer() {
        const playerGroup = this.lobby.players;
        return Object.values(playerGroup);
    }
    // PRIVATE METHODS
    get game() {
        return this.lobby.game;
    }
    sendGameState() {
        this.sendToAll('gameUpdate', this.game.getState('operative'));
        this.sendToSpyMasters('gameUpdate', this.game.getState('spymaster'));
    }
    sendSuggestions() {
        this.sendToAll('suggestionsUpdate', this.game.getState('operative').suggestions);
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
            this.socket.join(this.spymasterChannel);
            this.sendToMe('gameUpdate', this.game.getState('spymaster'));
        }
        this.socket.join(this.lobbyChannel);
        this.socket.join(this.lobbyChannel + this.player.id);
        this.player.isConnected = true;
        this.sendGameState();
        this.sendPlayerState();
        this.sendMyPlayerStatus();
    }
    joinTeamAndRole(team, role) {
        const { success } = this.game.setPlayerRole(this.player, role, team);
        if (success) {
            if (role === 'spymaster') {
                this.socket.join(this.spymasterChannel);
                this.sendToMe('gameUpdate', this.game.getState('spymaster'));
            }
            else {
                this.socket.leave(this.spymasterChannel);
            }
            this.sendPlayerState();
        }
    }
    makeGuess(id) {
        const { success } = this.game.makeGuess(this.player, id);
        if (success)
            this.sendGameState();
    }
    toggleSuggestion(id) {
        const { success } = this.game.toggleSuggestion(this.player, id);
        if (success)
            this.sendSuggestions();
    }
    endGuessing() {
        const { success } = this.game.endGuessing(this.player);
        if (success)
            this.sendGameState();
    }
    kickPlayer(id) {
        if (!this.isHost)
            return;
        const { success } = this.lobby.kickPlayer(id);
        if (success) {
            this.sendToSingleClient(id, 'kick');
            this.sendPlayerState();
        }
    }
    makeHost(id) {
        if (!this.isHost)
            return;
        const { success } = this.lobby.setHost(id);
        if (success) {
            this.sendPlayerState();
        }
    }
    giveClue(word, number) {
        const { success } = this.game.giveClue(this.player, { clue: word, number });
        if (success)
            this.sendGameState();
    }
    handleDisconnect() {
        this.player.isConnected = false;
        this.sendPlayerState();
    }
    startGame(options = {}) {
        if (!this.isHost)
            return;
        console.log('optController', options);
        this.game.startGame(options);
        this.sendGameState();
        this.sendPlayerState();
    }
    resetGame() {
        if (!this.isHost)
            return;
        this.game.resetGame();
        this.io.socketsLeave(this.spymasterChannel);
        this.sendGameState();
        this.sendPlayerState();
    }
    resetTeams() {
        if (!this.isHost)
            return;
        this.io.socketsLeave(this.spymasterChannel);
        this.game.resetTeams();
        this.sendPlayerState();
    }
}
exports.SocketController = SocketController;
