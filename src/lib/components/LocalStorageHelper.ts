export class LocalStorageHelper {
	private static readonly LOBBY_KEY = 'lobby';

	/**
	 * Sets a value in localStorage for a given key.
	 * @param key - The key under which the value will be stored.
	 * @param value - The value to store. Will be stringified.
	 */
	static setItem(key: string, value: any): void {
		try {
			const stringValue = JSON.stringify(value);
			localStorage.setItem(key, stringValue);
		} catch (error) {
			console.error('Error saving to localStorage', error);
		}
	}

	/**
	 * Gets a value from localStorage for a given key.
	 * @param key - The key for which to retrieve the value.
	 * @returns The parsed value, or null if the key doesn't exist.
	 */
	static getItem<T>(key: string): T | null {
		const item = localStorage.getItem(key);
		if (!item) return null;
		try {
			return JSON.parse(item) as T;
		} catch (error) {
			console.error('Error parsing data from localStorage', error);
			return null;
		}
	}

	/**
	 * Retrieves all keys stored in localStorage.
	 * @returns An array of all keys in localStorage.
	 */
	static getAllKeys(): string[] {
		return Object.keys(localStorage);
	}

	/**
	 * Removes an item from localStorage.
	 * @param key - The key of the item to remove.
	 */
	static removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * Clears all items from localStorage.
	 */
	static clear(): void {
		localStorage.clear();
	}

	/**
	 * Gets the entire lobby record.
	 * @returns The lobby record as Record<string, string>, or an empty object if the lobby doesn't exist.
	 */
	static getLobby(): Record<string, string> {
		return this.getItem<Record<string, string>>(this.LOBBY_KEY) || {};
	}

	/**
	 * Sets the entire lobby record.
	 * @param lobby - The lobby record to set in localStorage.
	 */
	static setLobby(lobby: Record<string, string>): void {
		this.setItem(this.LOBBY_KEY, lobby);
	}

	/**
	 * Gets a specific entry from the lobby record.
	 * @param entryKey - The key of the entry to retrieve from the lobby.
	 * @returns The value of the entry, or undefined if it doesn't exist.
	 */
	static getLobbyEntry(entryKey: string): string | undefined {
		const lobby = this.getLobby();
		return lobby[entryKey];
	}

	/**
	 * Adds or updates a specific entry in the lobby record.
	 * @param entryKey - The key of the entry to add or update.
	 * @param entryValue - The value to set for this entry.
	 */
	static setLobbyEntry(entryKey: string, entryValue: string): void {
		const lobby = this.getLobby();
		lobby[entryKey] = entryValue;
		this.setLobby(lobby);
	}

	/**
	 * Removes a specific entry from the lobby record.
	 * @param entryKey - The key of the entry to remove.
	 */
	static removeLobbyEntry(entryKey: string): void {
		const lobby = this.getLobby();
		delete lobby[entryKey];
		this.setLobby(lobby);
	}
}
