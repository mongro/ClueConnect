"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPEARANCE = void 0;
exports.createNewBoard = createNewBoard;
exports.default = random;
exports.partialShuffle = partialShuffle;
const types_1 = require("./types");
const en_js_1 = require("./words/en.js");
const de_js_1 = require("./words/de.js");
const wordLists = {
    en: en_js_1.words,
    de: de_js_1.words
};
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
exports.APPEARANCE = {
    low: [1, 3],
    middle: [4, 6],
    high: [7, 10]
};
function mixCustomAndBaseWords(words, customWords, appearance) {
    if (appearance === 'notFixed')
        return words.concat(customWords);
    console.log(exports.APPEARANCE);
    let countCustomWords = random(exports.APPEARANCE[appearance][0], exports.APPEARANCE[appearance][1]);
    countCustomWords = Math.min(countCustomWords, customWords.length);
    const selectedWordSample = partialShuffle(words, 25 - countCustomWords);
    const customWordSample = partialShuffle(customWords, countCustomWords);
    return selectedWordSample.concat(customWordSample);
}
function createNewBoard(opts = {}) {
    const options = { ...types_1.defaultOptions, ...opts };
    let words = wordLists[options.language];
    if (options.customWords && options.customWords.length > 0) {
        words = mixCustomAndBaseWords(words, options.customWords, options.appearanceCustomWords);
    }
    const wordsample = partialShuffle(words, 25);
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
