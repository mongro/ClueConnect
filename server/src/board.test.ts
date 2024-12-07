import { expect, test } from 'vitest';
import { APPEARANCE, createNewBoard } from './board';
import { words as wordListEn } from './words/en.js';
import { words as wordListDe } from './words/de.js';
import { AppearanceCustomWords, Card } from './types';

function validateAppearanceRange(cards: Card[], appearance: 'low' | 'middle' | 'high') {
	let countCustomWords = cards.reduce((prev, card) => {
		return card.word === 'customWord' ? prev + 1 : prev;
	}, 0);
	expect(countCustomWords).toBeGreaterThan(APPEARANCE[appearance][0] - 1);
	expect(countCustomWords).toBeLessThan(APPEARANCE[appearance][1] + 1);
}
test('no card should be revealed', () => {
	let words = createNewBoard();
	let containsRevealedWord = words.findIndex((word) => word.revealed === true);
	expect(containsRevealedWord).toBe(-1);
});

test('choose correct language word pack', () => {
	let words = createNewBoard({ language: 'en' });
	let index = wordListEn.findIndex((word) => word === words[0].word);
	expect(index).toBeGreaterThan(-1);
	words = createNewBoard({ language: 'de' });
	index = wordListDe.findIndex((word) => word === words[0].word);
	expect(index).toBeGreaterThan(-1);
});

test('Number of customWords is in fixed range', () => {
	const customWords = Array(25).fill('customWord');
	let cards = createNewBoard({ customWords, appearanceCustomWords: 'high' });
	validateAppearanceRange(cards, 'high');
	cards = createNewBoard({ customWords, appearanceCustomWords: 'middle' });
	validateAppearanceRange(cards, 'middle');
	cards = createNewBoard({ customWords, appearanceCustomWords: 'low' });
	validateAppearanceRange(cards, 'low');
});
