import { Lobby } from '$server/Lobby';
import { GameState, ServerToClientEvents, Team } from '$server/types';
import OpenAI from 'openai';
import { ApiError } from '@google/genai';
import { createBotGuesser, createBotSpymaster } from './createBot';

export type BotComposition = {
	red: { operative: Bot | null; spymaster: Bot | null };
	blue: { operative: Bot | null; spymaster: Bot | null };
};

export class BotRunner {
	lobby: Lobby;
	sendToAll: <T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) => void;
	onGameChange?: (gameState?: GameState) => void;
	onBotChange?: () => void;
	delay: number;
	batchUpdates: boolean;

	constructor(
		lobby: Lobby,
		sendToAll: <T extends keyof ServerToClientEvents>(
			event: T,
			...data: Parameters<ServerToClientEvents[T]>
		) => void,
		config: BotRunnerConfig
	) {
		this.lobby = lobby;
		this.sendToAll = sendToAll;
		this.onGameChange = config.onGameChange;
		this.onBotChange = config.onBotChange;
		this.delay = config.delay ?? 0;
		this.batchUpdates = config.batchUpdates ?? true;
	}

	async run() {
		console.log(this.lobby.game.getState('operative').currentClue);
		if (this.lobby.hasNoConnectedPlayers()) return;
		const activeBot = this.lobby.getActiveBot();
		if (activeBot) {
			let bot;
			if (activeBot.role == 'spymaster') {
				bot = createBotSpymaster(this.lobby.game, activeBot.type);
			} else {
				bot = createBotGuesser(this.lobby.game, activeBot.type, this.onGameChange);
			}
			try {
				console.log('play turn');
				if (this.onBotChange) {
					this.lobby.setBotisThinking(activeBot, true);
					this.onBotChange();
				}
				await bot.playTurn();
			} catch (error) {
				if (error instanceof OpenAI.APIError) {
					this.lobby.deleteAllBots();
					this.sendToAll('errorMessage', {
						message: 'Bots are currently not working',
						status: error.status
					});
				}
				if (error instanceof ApiError) {
					this.lobby.deleteAllBots();
					this.sendToAll('errorMessage', {
						message: 'Bots are currently not working',
						status: error.status
					});
				} else {
					console.log('Error');

					throw error;
				}
			}
			if (this.onBotChange) {
				this.lobby.setBotisThinking(activeBot, false);
				this.onBotChange();
			}
			if (this.onGameChange) {
				this.onGameChange();
			}
		}

		setTimeout(this.run.bind(this), this.delay);
	}
}
export type BotSpymasterTypes = 'gpt' | 'gemini';
export type BotGuesserTypes = 'gemini' | 'gpt' | 'random';

type SpymasterBot = {
	team: Team;
	role: 'spymaster';
	name?: string;
	type?: BotSpymasterTypes;
	isThinking?: boolean;
};
type GuesserBot = {
	team: Team;
	role: 'operative';
	name?: string;
	type?: BotGuesserTypes;
	isThinking?: boolean;
};

export type BotRunnerConfig = {
	onGameChange?: (gameState?: GameState) => void;
	onBotChange?: () => void;
	batchUpdates?: boolean;
	delay?: number;
} & (
	| {
			batchUpdates?: true;
	  }
	| {
			delay: number;
			batchUpdates?: false;
	  }
);

export type Bot = GuesserBot | SpymasterBot;
