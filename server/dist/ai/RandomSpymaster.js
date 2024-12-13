"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomSpymaster = void 0;
const BotSpymaster_1 = require("./BotSpymaster");
class RandomSpymaster extends BotSpymaster_1.BotSpymaster {
    constructor(game) {
        super(game);
    }
    async createClue() {
        return { clue: 'random', number: Math.floor(Math.random() * 3) };
    }
}
exports.RandomSpymaster = RandomSpymaster;
