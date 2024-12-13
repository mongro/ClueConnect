import { Game } from '$server/Game';
import { GameState, Role, Team } from '$server/types';
import { createBotGuesser, createBotSpymaster } from './createBot';

type BotComposition = {
	red: { operative: Bot | null; spymaster: Bot | null };
	blue: { operative: Bot | null; spymaster: Bot | null };
};

export class BotRunner {
	bots: BotComposition;
	game: Game;
	onGameChange?: (gameState?: GameState) => void;
	delay: number;
	batchUpdates: boolean;

	constructor(game: Game, config: BotRunnerConfig) {
		this.bots = {
			red: { operative: null, spymaster: null },
			blue: { operative: null, spymaster: null }
		};
		this.game = game;
		this.onGameChange = config.onGameChange;
		this.delay = config.delay ?? 0;
		this.batchUpdates = config.batchUpdates ?? true;
	}

	private getActiveBot() {
		return this.bots[this.game.currentTeam][this.game.currentClue ? 'operative' : 'spymaster'];
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	addBot(team: Team, role: Role, name: string) {
		this.bots[team][role] = { team, role, name };
	}

	deleteBot(role: Role, team: Team) {
		this.bots[team][role] = null;
	}

	async run() {
		console.log('bot run');
		console.log('bots', this.bots);
		console.log('activeBots', this.getActiveBot());
		let safeGuard = 20;
		let activeBot = this.getActiveBot();
		while (!this.game.gameover && activeBot && safeGuard > 0) {
			console.log('play turn', this.getActiveBot());
			this.getActiveBot();
			if (activeBot.role == 'spymaster') {
				const bot = createBotSpymaster(this.game, activeBot.type);
				await bot.playTurn();
			} else if (activeBot.role == 'operative') {
				const bot = createBotGuesser(this.game, activeBot.type, this.onGameChange);
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
			activeBot = this.getActiveBot();
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
	name: string;
	type?: BotSpymasterTypes;
};
type GuesserBot = {
	team: Team;
	role: 'operative';
	name: string;
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
