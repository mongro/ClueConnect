"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotSpymaster = void 0;
class BotSpymaster {
    game;
    constructor(game) {
        this.game = game;
    }
    async playTurn() {
        let responses = 0;
        while (responses < 5 && !this.game.currentClue) {
            const clue = await this.createClue();
            responses++;
            console.log('spymasterAi gives clue: ', clue);
            if (!clue) {
                continue;
            }
            this.game.giveClue('bot', clue);
        }
    }
}
exports.BotSpymaster = BotSpymaster;
