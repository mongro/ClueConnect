"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewBoard = createNewBoard;
exports.default = random;
exports.partialShuffle = partialShuffle;
const en_js_1 = require("./words/en.js");
const UNSHUFFLED = [
    'black',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'grey',
    'grey',
    'grey',
    'grey',
    'grey',
    'grey',
    'grey'
];
function createNewBoard() {
    const wordsample = partialShuffle(en_js_1.words, 25);
    const shuffled = partialShuffle(UNSHUFFLED, UNSHUFFLED.length);
    return shuffled.map((type, index) => ({ type, word: wordsample[index], revealed: false }));
}
function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}
function partialShuffle(array, n) {
    if (n > array.length) {
        throw new Error('Cannot select more elements than available in the array');
    }
    const shuffled = array.slice(); // Create a shallow copy to avoid modifying the original
    const last = shuffled.length - 1;
    for (let i = 0; i < n; i++) {
        const j = random(i, last);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    // Return first n elements of the shuffled array
    return shuffled.slice(0, n);
}
