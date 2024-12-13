"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBotSpymaster = exports.createBotGuesser = void 0;
const GPTGuesser_1 = require("./GPTGuesser");
const GPTSpymaster_1 = require("./GPTSpymaster");
const RandomGuesser_1 = require("./RandomGuesser");
const RandomSpymaster_1 = require("./RandomSpymaster");
const createBotGuesser = (game, type, onGameChange) => {
    if (type === 'gpt') {
        return new GPTGuesser_1.ChatGptGuesser(game, onGameChange);
    }
    if (type === 'random') {
        return new RandomGuesser_1.RandomGuesser(game, onGameChange);
    }
    return new RandomGuesser_1.RandomGuesser(game, onGameChange);
};
exports.createBotGuesser = createBotGuesser;
const createBotSpymaster = (game, type) => {
    if (type === 'gpt') {
        return new GPTSpymaster_1.ChatGptSpymaster(game);
    }
    if (type === 'random') {
        return new RandomSpymaster_1.RandomSpymaster(game);
    }
    return new RandomSpymaster_1.RandomSpymaster(game);
};
exports.createBotSpymaster = createBotSpymaster;
