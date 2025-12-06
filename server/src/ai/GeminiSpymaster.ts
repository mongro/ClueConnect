import { Game } from '../Game';
import { z } from 'zod';
import { BotSpymaster } from './BotSpymaster';
import geminiAi from './gemini';

const clueObject = z.object({
	clue: z.string(),
	number: z.number(),
	words: z.array(z.string())
});

export class GeminiSpymaster extends BotSpymaster {
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
		prompt += `Make sure the clue is NOT a word on the board.`;
		prompt += `The clue must have the same language as the words on the board`;
		prompt += `Make sure there is not a close connection between the black word and your clue`;
		prompt += `Again it is important, the clue should connect words of the type ${this.game.currentTeam}`;

		const response = await geminiAi.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt,
			config: {
				systemInstruction: `You are playing the word association game "Codenames" as the ${this.game.currentTeam} guesser`,
				responseMimeType: 'application/json',
				responseJsonSchema: z.toJSONSchema(clueObject)
			}
		});
		if (!response.text) return null;
		const content = clueObject.parse(JSON.parse(response.text));
		return content;
	}
}
