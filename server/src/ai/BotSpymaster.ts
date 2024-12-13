import { Game } from '$server/Game';
import { Clue } from '$server/types';

export abstract class BotSpymaster {
	game: Game;
	constructor(game: Game) {
		this.game = game;
	}

	async playTurn() {
		let responses = 0;

		while (responses < 5 && !this.game.currentClue) {
			const clue = await this.createClue();
			responses++;
			console.log('spymasterAi gives clue: ', clue);
			if (!clue) {
				continue;
			}
			this.game.giveClue('bot', clue);
		}
	}

	abstract createClue(): Promise<Clue | null>;
}
