import { createNewBoard } from './Board';
import { Card, Clue, GameAction, GameState, Player, Role, Team, TeamComposition } from './types';

export class Game {
	id: number;
	winner: Team | null = null;
	currentClue: Clue | null = null;
	maxOperatives = 3;
	maxSpyMasters = 3;
	currentGuesses: number = 0;
	currentTeam: Team = 'red';
	gameover: boolean = false;
	score: { blue: number; red: number } = { red: 9, blue: 8 };
	log: GameAction[] = [];
	suggestions: Partial<Record<number, number[]>> = {};
	player: Record<string, Player> = {};
	board: Card[] = createNewBoard();

	constructor(id: number, player: Record<string, Player>) {
		this.id = id;
		this.player = player;
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

	privateRevealCard(cardId: number) {
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
		const { currentClue, currentGuesses, currentTeam, gameover, log, score, winner, suggestions } =
			this;
		const cardsForOperatorives = this.board.map((card) => {
			const { revealed, type, word } = card;
			return { revealed, word, type: revealed ? type : 'grey' };
		});

		return {
			currentClue,
			suggestions,
			currentGuesses,
			currentTeam,
			gameover,
			log,
			score,
			board: role === 'operative' ? cardsForOperatorives : this.board,
			winner
		};
	}

	public reset(): void {
		this.board = createNewBoard();
		this.log = [];
		this.currentClue = null;
		this.gameover = false;
		this.score = { red: 9, blue: 8 };
		this.currentTeam = 'red';
	}

	public setPlayerRole(player: Player, role: Role, team: Team): { success: boolean } {
		if (this.playersWithRole(role, team) < this.maxSpyMasters) {
			player.role = role;
			player.team = team;
			return { success: true };
		}
		return { success: false };
	}

	public endGuessing(player: Player) {
		if (player.role != 'operative' || player.team != this.currentTeam) {
			return { success: false };
		}
		this.switchTurnToOtherTeam();

		return { success: true };
	}

	public toggleSuggestion(player: Player, cardId: number) {
		if (player.role != 'operative' || player.team != this.currentTeam) {
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

	public makeGuess(player: Player, cardId: number) {
		if (!this.currentClue)
			return {
				success: false
			};
		if (this.currentClue.number < this.currentGuesses) {
			return { success: false };
		}
		if (player.role != 'operative' || player.team != this.currentTeam) {
			return { success: false };
		}
		this.log.push({
			type: 'guess',
			team: this.currentTeam,
			word: this.board[cardId].word,
			player: player.name
		});
		this.privateRevealCard(cardId);
		return { success: true };
	}

	public giveClue(player: Player, clue: Clue) {
		if (this.currentClue != null) {
			return { success: false };
		}
		if (player.role != 'spymaster' || player.team != this.currentTeam) {
			return { success: false };
		}
		this.log.push({
			type: 'clue',
			team: this.currentTeam,
			clue: clue,
			player: player.name
		});
		this.currentClue = clue;
		return { success: true };
	}
}
