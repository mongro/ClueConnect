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
	private history: Array<ChatCompletionMessageParam>;
	constructor(game: Game, onGameChange?: (gameState?: GameState) => void) {
		super(game, onGameChange);
		this.history = [
			{ role: 'system', content: gameRules },
			{
				role: 'system',
				content: `You are playing the association game 'Codenames' as the ${game.currentTeam} guesser`
			}
		];
	}

	private createRemainingWords(board: Card[]) {
		return board
			.filter((card) => !card.revealed)
			.map((card) => card.word)
			.join(',');
	}

	async createGuess(board: Card[], clue: Clue) {
		console.log(this.createRemainingWords(board));
		let prompt = 'The remaining words are: ' + this.createRemainingWords(board) + '. \n';
		prompt += "The following is the codemaster's clue: " + `(${clue.clue},${clue.number}` + '. \n';
		prompt += 'Provide a guess for one of the remaining words associated with this clue. \n';
		prompt +=
			'If you absolutely cant find a word that creates an associatiton with the clue, answer by setting endGuessing in the JSON response to false\n';
		prompt += 'Provide a reason for your desicion in the reason field of the JSON response" \n';
		this.history.push({ role: 'user', content: prompt });
		const response = await openai.beta.chat.completions.parse({
			messages: this.history,
			model: 'gpt-4o-mini',
			response_format: zodResponseFormat(guessObject, 'guess')
		});

		const content = response.choices[0].message.parsed;
		if (!content) return null;
		console.log('content', content.guess, content.reason);
		this.history.push({ role: 'assistant', content: content.guess });
		return content;
	}
}
