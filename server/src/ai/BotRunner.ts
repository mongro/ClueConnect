import { Game } from '$server/Game';
import { Lobby } from '$server/Lobby';
import { GameState, Role, ServerToClientEvents, Team } from '$server/types';
import OpenAI from 'openai';
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
		this.delay = config.delay ?? 0;
		this.batchUpdates = config.batchUpdates ?? true;
		console.log('create botrunner');
	}

	async run() {
		console.log(this.lobby.game.getState('operative').currentClue);
		if (this.lobby.hasNoConnectedPlayers()) return;
		let activeBot = this.lobby.getActiveBot();
		console.log('aciveBot', activeBot);
		if (activeBot) {
			let bot;
			console.log('bot active');
			if (activeBot.role == 'spymaster') {
				bot = createBotSpymaster(this.lobby.game, activeBot.type);
			} else {
				bot = createBotGuesser(this.lobby.game, activeBot.type, this.onGameChange);
			}
			console.log('bot created');
			try {
				console.log('play turn');

				await bot.playTurn();
			} catch (error) {
				if (error instanceof OpenAI.APIError) {
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

			if (this.onGameChange) {
				console.log('update game');

				this.onGameChange();
			}
		}

		setTimeout(this.run.bind(this), this.delay);
	}
}
export type BotSpymasterTypes = 'gpt';
export type BotGuesserTypes = 'gpt' | 'random';

type SpymasterBot = {
	team: Team;
	role: 'spymaster';
	name?: string;
	type?: BotSpymasterTypes;
};
type GuesserBot = {
	team: Team;
	role: 'operative';
	name?: string;
	type?: BotGuesserTypes;
};

export type BotRunnerConfig = {
	onGameChange?: (gameState?: GameState) => void;
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
