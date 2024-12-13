"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = void 0;
const BotRunner_1 = require("./ai/BotRunner");
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
    botRunner;
    constructor(socket, io, lobby, player, botRunner) {
        this.socket = socket;
        this.io = io;
        this.lobby = lobby;
        this.player = player;
        this.botRunner = botRunner;
    }
    // AUXILIARY PRIVATE METHODS
    get isHost() {
        return this.player.isHost;
    }
    get lobbyChannel() {
        return this.lobby.id;
    }
    get spymasterChannel() {
        return this.lobby.id + SPYMASTER_CHANNEL_KEYWORD;
    }
    get userChannel() {
        return this.lobbyChannel + '/' + this.player.id;
    }
    sendToAll(event, ...data) {
        this.io
            .to(this.lobbyChannel)
            .to(this.spymasterChannel)
            .emit(event, ...data);
    }
    sendToMe(event, ...data) {
        this.socket.emit(event, ...data);
    }
    sendToSingleClient(id, event, ...data) {
        this.io.to(this.lobbyChannel + id).emit(event, ...data);
    }
    sendToSpyMasters(event, ...data) {
        this.io.to(this.spymasterChannel).emit(event, ...data);
    }
    sendToNotSpyMasters(event, ...data) {
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
        this.sendToNotSpyMasters('gameUpdate', this.game.getState('operative'));
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
        this.socket.join(this.lobbyChannel);
        this.socket.join(this.userChannel);
        if (this.player.role === 'spymaster') {
            this.socket.join(this.spymasterChannel);
            this.socket.leave(this.lobbyChannel);
            this.sendToMe('gameUpdate', this.game.getState('spymaster'));
        }
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
                this.socket.leave(this.lobbyChannel);
                this.sendToMe('gameUpdate', this.game.getState('spymaster'));
                this.addBot('operative', team, 'Horst');
                this.addBot('spymaster', team == 'red' ? 'blue' : 'red', 'Horst');
                this.addBot('operative', team == 'red' ? 'blue' : 'red', 'Horst');
            }
            else {
                this.socket.leave(this.spymasterChannel);
                this.socket.join(this.lobbyChannel);
            }
            this.sendPlayerState();
        }
    }
    makeGuess(id) {
        const { success } = this.game.makeGuess(this.player, id);
        if (success)
            this.sendGameState();
        if (this.botRunner) {
            this.botRunner.run();
        }
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
        if (this.botRunner) {
            this.botRunner.run();
        }
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
        if (this.botRunner) {
            this.botRunner.run();
        }
    }
    async handleDisconnect() {
        const matchingSockets = await this.io.in(this.userChannel).fetchSockets();
        const isDisconnected = matchingSockets.length === 0;
        if (isDisconnected) {
            this.player.isConnected = false;
            this.sendPlayerState();
        }
    }
    startGame(options = {}) {
        if (!this.isHost)
            return;
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
    addBot(role, team, name) {
        if (!this.botRunner) {
            this.botRunner = new BotRunner_1.BotRunner(this.lobby.game, {
                onGameChange: this.sendGameState.bind(this),
                batchUpdates: false,
                delay: 2000
            });
        }
        this.botRunner.addBot(team, role, name);
    }
}
exports.SocketController = SocketController;
