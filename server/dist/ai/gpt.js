"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRules = void 0;
const openai_1 = __importDefault(require("openai"));
exports.gameRules = `Codenames is a game of language understanding and communication.
At the start of the game, the board consists of 25 English words.
The Codemaster has access to a hidden map that tells them the identity of all of the words (red, blue, grey or black).
The Codemaster then supplies a clue and a number (the number of guesses the Guesser is obligated to make)
The clue must:
- Be semantically related to what the Codemaster wants their guesser to guess.
- Be a single English word.
- NOT be derived from or derive one of the words on the board.
It is important for the guesser to correctly order their guesses, as ordering is important.
If a guesser guesses an invalid clue , their turn is forfeit.
Play proceeds, passing back and forth, until one of 3 outcomes is achieved:
All of the Red tiles have been found -- Red Team wins.
All of the Blue tiles have been found -- Blue Team wins.
The single black tile is found -- Opponent Team wins
 `;
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw Error('Open Ai Key is not set.');
}
const openai = new openai_1.default({ apiKey });
exports.default = openai;
