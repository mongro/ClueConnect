import { Card, Clue, GameState } from '../types';
import { Game } from '../Game';
import { BotGuesser } from './BotGuesser';

export class RandomGuesser extends BotGuesser {
	constructor(game: Game, onGameChange?: (gameState?: GameState) => void) {
		super(game, onGameChange);
	}

	async createGuess(board: Card[], clue: Clue) {
		const remainingCards = board.filter((card) => !card.revealed);
		const index = Math.floor(Math.random() * remainingCards.length);
		return { guess: remainingCards[index].word, endGuessing: false };
	}
}
