import { Game } from '$server/Game';
import { Lobby } from '$server/Lobby';
import { GameState, Role, Team } from '$server/types';
import { createBotGuesser, createBotSpymaster } from './createBot';

export type BotComposition = {
	red: { operative: Bot | null; spymaster: Bot | null };
	blue: { operative: Bot | null; spymaster: Bot | null };
};

export class BotRunner {
	lobby: Lobby;
	onGameChange?: (gameState?: GameState) => void;
	delay: number;
	batchUpdates: boolean;

	constructor(lobby: Lobby, config: BotRunnerConfig) {
		this.lobby = lobby;
		this.onGameChange = config.onGameChange;
		this.delay = config.delay ?? 0;
		this.batchUpdates = config.batchUpdates ?? true;
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async run() {
		let safeGuard = 20;
		let activeBot = this.lobby.getActiveBot();
		while (!this.lobby.game.gameover && activeBot && safeGuard > 0) {
			console.log('play turn', this.lobby.getActiveBot());
			this.lobby.getActiveBot();
			if (activeBot.role == 'spymaster') {
				const bot = createBotSpymaster(this.lobby.game, activeBot.type);
				await bot.playTurn();
			} else if (activeBot.role == 'operative') {
				const bot = createBotGuesser(this.lobby.game, activeBot.type, this.onGameChange);
				console.log('bot created');
				console.log('bot created');
				await bot.playTurn();
			}
			safeGuard--;

			//sending gameUpdates between ai turns with delay to simulate human game flow
			if (!this.batchUpdates && this.onGameChange) {
				this.onGameChange();
				await this.sleep(this.delay);
			}
			activeBot = this.lobby.getActiveBot();
		}
		if (this.onGameChange) {
			this.onGameChange();
		}
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
