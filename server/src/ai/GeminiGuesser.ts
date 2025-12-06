import geminiAi from './gemini';
import { Card, Clue, GameState } from '../types';
import { Game } from '../Game';
import { BotGuesser } from './BotGuesser';
import { z } from 'zod';

const guessObject = z.object({
	guess: z.string(),
	endGuessing: z.boolean(),
	reason: z.string()
});

export class GeminiGuesser extends BotGuesser {
	constructor(game: Game, onGameChange?: (gameState?: GameState) => void) {
		super(game, onGameChange);
	}

	private createRemainingWords(board: Card[]) {
		return board
			.filter((card) => !card.revealed)
			.map((card) => card.word)
			.join(',');
	}

	async createGuess(board: Card[], clue: Clue) {
		console.log(this.createRemainingWords(board));
		let prompt = 'Remaining words: ' + this.createRemainingWords(board) + '. \n';
		prompt += 'Clue of codemaster: ' + `(${clue.clue},${clue.number}` + '. \n';
		prompt += 'Provide a guess for one of the remaining words associated with this clue. \n';
		prompt +=
			'If you absolutely cant find a word that creates an associatiton with the clue, answer by setting endGuessing in the JSON response to false\n';
		prompt += 'Provide a reason for your desicion in the reason field of the JSON response" \n';

		const response = await geminiAi.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt,
			config: {
				systemInstruction: `You are playing the word association game "Codenames" as the ${this.game.currentTeam} guesser`,
				responseMimeType: 'application/json',
				responseJsonSchema: z.toJSONSchema(guessObject)
			}
		});
		if (!response.text) return null;
		const content = guessObject.parse(JSON.parse(response.text));

		return content;
	}
}
