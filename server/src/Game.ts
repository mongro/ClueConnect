import { createNewBoard } from './board';
import { Card, Clue, GameAction, GameOptions, GameState, Player, Role, Team } from './types';

export class Game {
	id: number;
	winner: Team | null = null;
	currentClue: Clue | null = null;
	maxOperatives = 3;
	maxSpyMasters = 1;
	currentGuesses: number = 0;
	currentTeam: Team = 'red';
	gameover: boolean = false;
	score: { blue: number; red: number } = { red: 9, blue: 8 };
	log: GameAction[] = [];
	suggestions: Partial<Record<number, number[]>> = {};
	player: Record<string, Player> = {};
	board: Card[] = [];
	options: Partial<GameOptions> = {};

	constructor(id: number, player: Record<string, Player>) {
		this.id = id;
		this.player = player;
	}

	get hasStarted() {
		return this.board.length > 0;
	}

	private initGameState() {
		this.winner = null;
		this.suggestions = {};
		this.log = [];
		this.board = [];
		this.currentClue = null;
		this.gameover = false;
		this.score = { red: 9, blue: 8 };
		this.currentTeam = 'red';
	}

	private getBoardWithHiddenTypes() {
		return this.board.map((card) => {
			const { revealed, type, word } = card;
			return { revealed, word, type: revealed ? type : 'grey' };
		});
	}

	private isPlayerTurn(player: Player) {
		return (
			this.hasStarted &&
			player.team == this.currentTeam &&
			player.role == (this.currentClue ? 'operative' : 'spymaster')
		);
	}

	private switchTurnToOtherTeam() {
		this.currentTeam = this.currentTeam === 'blue' ? 'red' : 'blue';
		this.currentGuesses = 0;
		this.currentClue = null;
		this.suggestions = {};
	}
	private declareWinner(team: Team) {
		this.gameover = true;
		this.winner = team;
	}

	private playersWithRole(role: Role, team: Team) {
		return Object.values(this.player).reduce((count: number, player) => {
			if (player.role === role && player.team === team) count++;
			return count;
		}, 0);
	}

	getActivePlayers() {
		return Object.values(this.player).filter((player) => {
			return (
				player.role == (this.currentClue ? 'operative' : 'spymaster') &&
				player.team === this.currentTeam
			);
		});
	}

	private revealCard(cardId: number) {
		if (!this.currentClue) return;
		const { type, word } = this.board[cardId];
		this.board[cardId] = { type, word, revealed: true };

		if (type === 'black') {
			this.declareWinner(this.currentTeam === 'blue' ? 'red' : 'blue');
			return;
		}
		if (type === 'grey') {
			this.switchTurnToOtherTeam();
			return;
		}
		if (type === this.currentTeam) {
			this.score[type]--;
			this.currentGuesses++;
			if (this.score[type] === 0) {
				this.declareWinner(this.currentTeam);
				return;
			}
			if (this.currentClue.number < this.currentGuesses) {
				this.switchTurnToOtherTeam();
				return;
			}
		}
		if (type != this.currentTeam) {
			this.score[type]--;
			this.switchTurnToOtherTeam();
		}
	}

	public getState(role: Role): GameState {
		const {
			currentClue,
			currentGuesses,
			currentTeam,
			gameover,
			log,
			score,
			winner,
			suggestions,
			options
		} = this;
		return {
			options,
			currentClue,
			suggestions,
			currentGuesses,
			currentTeam,
			gameover,
			log,
			score,
			board: role === 'operative' && !this.gameover ? this.getBoardWithHiddenTypes() : this.board,
			winner
		};
	}

	public startGame(options: Partial<GameOptions>): void {
		this.initGameState();
		this.board = createNewBoard(options);
		this.options = options;
	}
	public resetGame(): void {
		this.initGameState();
		this.resetTeams();
	}

	public resetTeams() {
		if (this.hasStarted) return;
		for (let player of Object.values(this.player)) {
			player.role = undefined;
			player.team = undefined;
		}
	}

	public setPlayerRole(player: Player, role: Role, team: Team): { success: boolean } {
		if (
			(role === 'spymaster' && this.playersWithRole('spymaster', team) < this.maxSpyMasters) ||
			(role === 'operative' && this.playersWithRole('operative', team) < this.maxOperatives)
		) {
			player.role = role;
			player.team = team;
			return { success: true };
		}
		return { success: false };
	}

	public endGuessing(player?: Player) {
		if (player && !this.isPlayerTurn(player)) {
			return { success: false };
		}
		this.switchTurnToOtherTeam();

		return { success: true };
	}

	public toggleSuggestion(player: Player, cardId: number) {
		if (!this.isPlayerTurn(player)) {
			return { success: false };
		}
		let suggestions = this.suggestions[cardId] ?? [];
		const index = suggestions.indexOf(player.id);

		if (index === -1) {
			// Value not found, add it
			suggestions.push(player.id);
		} else {
			// Value found, remove it
			suggestions.splice(index, 1);
		}
		this.suggestions[cardId] = suggestions;

		return { success: true, suggestions: this.suggestions };
	}

	public makeGuess(player: Player | 'bot', cardId: number) {
		console.log('cardId', cardId);
		if (!this.currentClue)
			return {
				success: false
			};
		if (this.currentClue.number < this.currentGuesses) {
			return { success: false };
		}
		if (!(player == 'bot') && !this.isPlayerTurn(player)) {
			return { success: false };
		}
		this.log.push({
			type: 'guess',
			team: this.currentTeam,
			word: this.board[cardId].word,
			player: player == 'bot' ? 'BOT' : player.name,
			cardType: this.board[cardId].type
		});
		this.revealCard(cardId);
		return { success: true };
	}

	public giveClue(player: Player | 'bot', clue: Clue) {
		if (this.currentClue != null) {
			return { success: false };
		}
		if (!(player == 'bot') && !this.isPlayerTurn(player)) {
			console.log('notplayersTurn');
			return { success: false };
		}
		this.log.push({
			type: 'clue',
			team: this.currentTeam,
			clue: clue,
			player: player == 'bot' ? 'BOT' : player.name
		});
		this.currentClue = clue;
		return { success: true };
	}
}
