import { Lobby } from './Lobby';

class LobbyDB {
	private lobbys: Record<string, Lobby> = {};

	public getOrCreateById(id: string): Lobby {
		if (this.has(id)) return this.get(id)!;
		const lobbyNew = new Lobby(id);
		this.add(id, lobbyNew);
		return lobbyNew;
	}

	public add(id: string, item: Lobby): void {
		this.lobbys[id] = item;
	}

	public get(id: string): Lobby | undefined {
		return this.lobbys[id];
	}

	public remove(id: string): void {
		delete this.lobbys[id];
	}

	public has(id: string): boolean {
		return this.lobbys[id] !== undefined;
	}

	public clear(): void {
		this.lobbys = {};
	}

	public get keys(): string[] {
		return Object.keys(this.lobbys);
	}

	public get items(): Lobby[] {
		return Object.values(this.lobbys);
	}

	public get size(): number {
		return this.keys.length;
	}
}

const db = new LobbyDB();

export default db;
