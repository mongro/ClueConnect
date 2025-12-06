import { Game } from '$server/Game';
import { GameState } from '$server/types';
import { BotGuesser } from './BotGuesser';
import { BotGuesserTypes, BotSpymasterTypes } from './BotRunner';
import { BotSpymaster } from './BotSpymaster';
import { GeminiGuesser } from './GeminiGuesser';
import { GeminiSpymaster } from './GeminiSpymaster';
import { ChatGptGuesser } from './GPTGuesser';
import { ChatGptSpymaster } from './GPTSpymaster';
import { RandomGuesser } from './RandomGuesser';
import { RandomSpymaster } from './RandomSpymaster';

export const createBotGuesser = (
	game: Game,
	type?: BotGuesserTypes,
	onGameChange?: (gameState?: GameState) => void
): BotGuesser => {
	if (type === 'gpt') {
		return new ChatGptGuesser(game, onGameChange);
	}
	if (type === 'gemini') {
		return new GeminiGuesser(game, onGameChange);
	}
	if (type === 'random') {
		return new RandomGuesser(game, onGameChange);
	}
	return new RandomGuesser(game, onGameChange);
};

export const createBotSpymaster = (game: Game, type?: BotSpymasterTypes): BotSpymaster => {
	if (type === 'gpt') {
		return new ChatGptSpymaster(game);
	}
	if (type === 'gemini') {
		return new GeminiSpymaster(game);
	}
	if (type === 'random') {
		return new RandomSpymaster(game);
	}
	return new RandomSpymaster(game);
};
