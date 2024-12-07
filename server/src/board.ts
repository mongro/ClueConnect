import { AppearanceCustomWords, Card, CardType, defaultOptions, GameOptions } from './types';
import { words as wordListEn } from './words/en.js';
import { words as wordListDe } from './words/de.js';

const wordLists = {
	en: wordListEn,
	de: wordListDe
};
const UNSHUFFLED: CardType[] = [
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

export const APPEARANCE = {
	low: [1, 3],
	middle: [4, 6],
	high: [7, 10]
} as const;

function mixCustomAndBaseWords(
	words: string[],
	customWords: string[],
	appearance: AppearanceCustomWords
) {
	if (appearance === 'notFixed') return words.concat(customWords);
	console.log(APPEARANCE);
	let countCustomWords = random(APPEARANCE[appearance][0], APPEARANCE[appearance][1]);

	countCustomWords = Math.min(countCustomWords, customWords.length);
	const selectedWordSample = partialShuffle(words, 25 - countCustomWords);
	const customWordSample = partialShuffle(customWords, countCustomWords);

	return selectedWordSample.concat(customWordSample);
}

export function createNewBoard(opts: Partial<GameOptions> = {}): Card[] {
	const options = { ...defaultOptions, ...opts };
	let words = wordLists[options.language];

	if (options.customWords && options.customWords.length > 0) {
		words = mixCustomAndBaseWords(words, options.customWords, options.appearanceCustomWords);
	}

	const wordsample = partialShuffle(words, 25);
	const shuffled = partialShuffle(UNSHUFFLED, UNSHUFFLED.length);

	return shuffled.map((type, index) => ({ type, word: wordsample[index], revealed: false }));
}

export default function random(min: number, max: number) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (max - min + 1));
}
export function partialShuffle<T>(array: T[], n: number) {
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
