"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const board_1 = require("./board");
const en_js_1 = require("./words/en.js");
const de_js_1 = require("./words/de.js");
function validateAppearanceRange(cards, appearance) {
    let countCustomWords = cards.reduce((prev, card) => {
        return card.word === 'customWord' ? prev + 1 : prev;
    }, 0);
    (0, vitest_1.expect)(countCustomWords).toBeGreaterThan(board_1.APPEARANCE[appearance][0] - 1);
    (0, vitest_1.expect)(countCustomWords).toBeLessThan(board_1.APPEARANCE[appearance][1] + 1);
}
(0, vitest_1.test)('no card should be revealed', () => {
    let words = (0, board_1.createNewBoard)();
    let containsRevealedWord = words.findIndex((word) => word.revealed === true);
    (0, vitest_1.expect)(containsRevealedWord).toBe(-1);
});
(0, vitest_1.test)('choose correct language word pack', () => {
    let words = (0, board_1.createNewBoard)({ language: 'en' });
    let index = en_js_1.words.findIndex((word) => word === words[0].word);
    (0, vitest_1.expect)(index).toBeGreaterThan(-1);
    words = (0, board_1.createNewBoard)({ language: 'de' });
    index = de_js_1.words.findIndex((word) => word === words[0].word);
    (0, vitest_1.expect)(index).toBeGreaterThan(-1);
});
(0, vitest_1.test)('Number of customWords is in fixed range', () => {
    const customWords = Array(25).fill('customWord');
    let cards = (0, board_1.createNewBoard)({ customWords, appearanceCustomWords: 'high' });
    validateAppearanceRange(cards, 'high');
    cards = (0, board_1.createNewBoard)({ customWords, appearanceCustomWords: 'middle' });
    validateAppearanceRange(cards, 'middle');
    cards = (0, board_1.createNewBoard)({ customWords, appearanceCustomWords: 'low' });
    validateAppearanceRange(cards, 'low');
});
