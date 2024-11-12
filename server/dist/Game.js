"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./Board");
class Game {
    id;
    winner = null;
    currentClue = null;
    maxOperatives = 3;
    maxSpyMasters = 3;
    currentGuesses = 0;
    currentTeam = 'red';
    gameover = false;
    score = { red: 9, blue: 8 };
    log = [];
    suggestions = {};
    player = {};
    board = (0, Board_1.createNewBoard)();
    constructor(id, player) {
        this.id = id;
        this.player = player;
    }
    switchTurnToOtherTeam() {
        this.currentTeam = this.currentTeam === 'blue' ? 'red' : 'blue';
        this.currentGuesses = 0;
        this.currentClue = null;
    }
    declareWinner(team) {
        this.gameover = true;
        this.winner = team;
    }
    playersWithRole(role, team) {
        return Object.values(this.player).reduce((count, player) => {
            if (player.role === role && player.team === team)
                count++;
            return count;
        }, 0);
    }
    privateRevealCard(cardId) {
        if (!this.currentClue)
            return;
        const { type, word } = this.board[cardId];
        this.board[cardId] = { type, word, revealed: true };
        if (type === 'black') {
            this.declareWinner(this.currentTeam === 'blue' ? 'red' : 'blue');
            return;
        }
        if (type === 'grey') {
            this.switchTurnToOtherTeam();
            return;
        }
        if (type === this.currentTeam) {
            this.score[type]--;
            this.currentGuesses++;
            if (this.score[type] === 0) {
                this.declareWinner(this.currentTeam);
                return;
            }
            if (this.currentClue.number < this.currentGuesses) {
                this.switchTurnToOtherTeam();
                return;
            }
        }
        if (type != this.currentTeam) {
            this.score[type]--;
            this.switchTurnToOtherTeam();
        }
    }
    getSuggestions() {
        //Replace credentials of players to names for client usage
        let suggestionsMappedToNames = {};
        for (const key in Object.keys(this.suggestions).map(Number)) {
            let credentials = this.suggestions[key] ?? [];
            suggestionsMappedToNames[key] = credentials.map((item) => this.player[item].name);
        }
        return suggestionsMappedToNames;
    }
    getState(role) {
        const { currentClue, currentGuesses, currentTeam, gameover, log, score, winner, suggestions } = this;
        const cardsForOperatorives = this.board.map((card) => {
            const { revealed, type, word } = card;
            return { revealed, word, type: revealed ? type : 'grey' };
        });
        return {
            currentClue,
            suggestions,
            currentGuesses,
            currentTeam,
            gameover,
            log,
            score,
            board: role === 'operative' ? cardsForOperatorives : this.board,
            winner
        };
    }
    reset() {
        this.board = (0, Board_1.createNewBoard)();
        this.log = [];
        this.currentClue = null;
        this.gameover = false;
        this.score = { red: 9, blue: 8 };
        this.currentTeam = 'red';
    }
    setPlayerRole(credentials, role, team) {
        const player = this.player[credentials];
        if (this.playersWithRole(role, team) < this.maxSpyMasters) {
            this.player[credentials] = { ...player, role, team };
            return { success: true };
        }
        return { success: false };
    }
    endGuessing(credentials) {
        let player = this.player[credentials];
        if (player.role != 'operative' || player.team != this.currentTeam) {
            return { success: false };
        }
        this.switchTurnToOtherTeam();
        return { success: true };
    }
    toggleSuggestion(credentials, cardId) {
        let player = this.player[credentials];
        if (player.role != 'operative' || player.team != this.currentTeam) {
            return { success: false };
        }
        let suggestions = this.suggestions[cardId] ?? [];
        const index = suggestions.indexOf(credentials);
        if (index === -1) {
            // Value not found, add it
            suggestions.push(credentials);
        }
        else {
            // Value found, remove it
            suggestions.splice(index, 1);
        }
        this.suggestions[cardId] = suggestions;
        return { success: true, suggestions: this.suggestions };
    }
    makeGuess(credentials, cardId) {
        if (!this.currentClue)
            return {
                success: false
            };
        let player = this.player[credentials];
        if (this.currentClue.number < this.currentGuesses) {
            return { success: false };
        }
        if (player.role != 'operative' || player.team != this.currentTeam) {
            return { success: false };
        }
        this.log.push({
            type: 'guess',
            team: this.currentTeam,
            word: this.board[cardId].word,
            player: player.name
        });
        this.privateRevealCard(cardId);
        return { success: true };
    }
    giveClue(credentials, clue) {
        let player = this.player[credentials];
        if (this.currentClue != null) {
            return { success: false };
        }
        if (player.role != 'spymaster' || player.team != this.currentTeam) {
            return { success: false };
        }
        this.log.push({
            type: 'clue',
            team: this.currentTeam,
            clue: clue,
            player: player.name
        });
        this.currentClue = clue;
        return { success: true };
    }
}
exports.Game = Game;
