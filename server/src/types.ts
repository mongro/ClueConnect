export type Team = 'red' | 'blue';
export type TeamComposition = {
	red: { operative: Player[]; spymaster: Player[] };
	blue: { operative: Player[]; spymaster: Player[] };
};
export type Role = 'spymaster' | 'operative';
export type Clue = { clue: string; number: number };
export type Player = {
	id: number;
	name: string;
	role?: Role;
	isHost: boolean;
	team?: Team;
	isConnected: boolean;
};

export type CardType = 'black' | 'red' | 'blue' | 'grey';
export type Card = {
	type: CardType;
	word: string;
	revealed: boolean;
};
export type GameAction =
	| {
			type: 'guess';
			player: string;
			team: Team;
			word: string;
	  }
	| {
			type: 'clue';
			player: string;
			team: Team;
			clue: Clue;
	  };
export type GameState = {
	suggestions: Partial<Record<string, number[]>>;
	board: Card[];
	currentClue: Clue | null;
	currentGuesses: number;
	currentTeam: Team;
	gameover: boolean;
	score: { blue: number; red: number };
	log: GameAction[];
	winner: Team | null;
};

export interface ServerToClientEvents {
	kick: () => void;
	gameUpdate: (state: GameState) => void;
	playerUpdate: (player: Player[]) => void;
	suggestionsUpdate: (suggestions: Partial<Record<number, number[]>>) => void;
	myStatus: (player: Player) => void;
}

export interface ClientToServerEvents {
	kickPlayer: (id: number) => void;
	makeHost: (id: number) => void;
	sync: (id: string, credentials: string) => void;
	joinLobby: (id: string, credentials: string, name?: string) => void;
	joinTeamAndRole: (team: Team, role: Role) => void;
	startGame: () => void;
	resetGame: () => void;
	resetTeams: () => void;
	giveClue: (word: string, number: number) => void;
	makeGuess: (cardId: number) => void;
	toggleSuggestion: (cardId: number) => void;
	endGuessing: () => void;
}
