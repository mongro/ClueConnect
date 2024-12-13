"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGuesser = void 0;
const BotGuesser_1 = require("./BotGuesser");
class RandomGuesser extends BotGuesser_1.BotGuesser {
    constructor(game, onGameChange) {
        super(game, onGameChange);
    }
    async createGuess(board, clue) {
        const remainingCards = board.filter((card) => !card.revealed);
        const index = Math.floor(Math.random() * remainingCards.length);
        return { guess: remainingCards[index].word, endGuessing: false };
    }
}
exports.RandomGuesser = RandomGuesser;
