"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotGuesser = void 0;
class BotGuesser {
    game;
    onGameChange;
    constructor(game, onGameChange) {
        this.game = game;
        if (onGameChange) {
            this.onGameChange = onGameChange;
        }
    }
    validateGuess(guess) {
        console.log('guess', 'X' + guess + 'X');
        return this.game.board.findIndex((card) => card.word == guess && !card.revealed);
    }
    async playTurn() {
        let responses = 0;
        while (responses < 5 &&
            this.game.currentClue &&
            this.game.currentGuesses <= this.game.currentClue.number) {
            const response = await this.createGuess(this.game.board, this.game.currentClue);
            responses++;
            console.log('openAIRes', response);
            if (response === null) {
                continue;
            }
            const index = this.validateGuess(response.guess);
            console.log('index', index);
            console.log('index', this.game.board);
            if (index == -1) {
                continue;
            }
            this.game.makeGuess('bot', index);
            responses = 0;
        }
    }
}
exports.BotGuesser = BotGuesser;
