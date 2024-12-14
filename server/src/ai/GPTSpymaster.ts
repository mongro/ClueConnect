import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import openai, { gameRules } from './gpt';
import { GameState } from '../types';
import { Game } from '../Game';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { BotSpymaster } from './BotSpymaster';

const clueObject = z.object({
	clue: z.string(),
	number: z.number(),
	words: z.array(z.string())
});

export class ChatGptSpymaster extends BotSpymaster {
	constructor(game: Game) {
		super(game);
	}

	private createRemainingWords() {
		return this.game.board
			.filter((card) => !card.revealed)
			.map((card) => `${card.word}(${card.type})`)
			.join(',');
	}

	async createClue() {
		console.log(this.createRemainingWords());

		let prompt = 'The remaining words are: ' + this.createRemainingWords() + '. \n';
		prompt +=
			'Provide a single word clue,the words belonging to the clue and the number of words for the guesser.';
		prompt += `Make sure the words belonging to your clue only consists of type ${this.game.currentTeam}`;
		const response = await openai.beta.chat.completions.parse({
			messages: [
				{
					role: 'system',
					content: `You are playing the word association game "Codenames" as the ${this.game.currentTeam} spymaster`
				},
				{ role: 'user', content: prompt }
			],
			model: 'gpt-4o-mini',
			response_format: zodResponseFormat(clueObject, 'clue')
		});

		const content = response.choices[0].message.parsed;
		if (!content) return null;
		console.log('content', content);
		return content;
	}
}
