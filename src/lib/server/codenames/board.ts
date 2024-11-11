import { words } from '$lib/words/en';

export type CardType = 'black' | 'red' | 'blue';
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
	'blue'
];

export function createNewBoard() {
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
