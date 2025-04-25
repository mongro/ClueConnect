import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import openai, { gameRules } from './gpt';
import { Card, Clue, GameState } from '../types';
import { Game } from '../Game';
import { BotGuesser } from './BotGuesser';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const guessObject = z.object({
	guess: z.string(),
	endGuessing: z.boolean(),
	reason: z.string()
});

export class ChatGptGuesser extends BotGuesser {
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

		const response = await openai.beta.chat.completions.parse({
			messages: [
				{
					role: 'system',
					content: `You are playing the word association game "Codenames" as the ${this.game.currentTeam} guesser`
				},
				{ role: 'user', content: prompt }
			],
			model: 'gpt-4o-mini',
			response_format: zodResponseFormat(guessObject, 'guess')
		});

		const content = response.choices[0].message.parsed;
		console.log('content', content?.guess, content?.reason);
		if (!content) return null;

		return content;
	}
}
