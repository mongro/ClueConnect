import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import openai, { gameRules } from './gpt';
import { GameState } from '../types';
import { Game } from '../Game';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { BotSpymaster } from './BotSpymaster';

const clueObject = z.object({
	clue: z.string(),
	number: z.number()
});

export class ChatGptSpymaster extends BotSpymaster {
	private history: Array<ChatCompletionMessageParam>;
	constructor(game: Game) {
		super(game);
		this.history = [
			{ role: 'system', content: gameRules },
			{
				role: 'system',
				content: `You are playing the association game "Codenames" as the ${game.currentTeam} spymaster`
			}
		];
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
		prompt += 'Provide a single word clue and number for the guesser.';
		prompt += 'Stick to this format exactly and provide no additional text. ';
		this.history.push({ role: 'user', content: prompt });
		const response = await openai.beta.chat.completions.parse({
			messages: this.history,
			model: 'gpt-4o-mini',
			response_format: zodResponseFormat(clueObject, 'clue')
		});

		const content = response.choices[0].message.parsed;
		if (!content) return null;
		console.log('content', content);
		this.history.push({ role: 'assistant', content: content.clue });
		return content;
	}
}
