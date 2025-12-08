import { Game } from '../Game';
import { BotSpymaster } from './BotSpymaster';

export class RandomSpymaster extends BotSpymaster {
	constructor(game: Game) {
		super(game);
	}

	async createClue() {
		return { clue: 'random', number: Math.floor(Math.random() * 3) };
	}
}
