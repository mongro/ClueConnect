import { goto } from '$app/navigation';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { LocalStorageHelper } from './components/LocalStorageHelper';
import socket from './socket';

function syncWithLobby(id: string) {
	const credentials = LocalStorageHelper.getLobbyEntry(id);
	if (credentials) {
		socket.connect();
		socket.emit('joinLobby', id, credentials);
	}
}
export async function joinLobby(name: string, id: string) {
	try {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const res = await fetch(`${PUBLIC_SERVER_URL}/joinLobby`, {
			method: 'POST',
			body: JSON.stringify({ name, lobbyId: id }),
			headers: myHeaders
		});
		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}

		const response = await res.json();
		LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
		syncWithLobby(response.lobbyId);
	} catch (error) {
		console.error(error);
	}
}

export async function createLobby(name: string) {
	try {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const res = await fetch(`${PUBLIC_SERVER_URL}/createLobby`, {
			method: 'POST',
			body: JSON.stringify({ name }),
			headers: myHeaders
		});
		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}

		const response = await res.json();
		LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
		goto('/game/' + response.lobbyId);
	} catch (error) {
		console.error(error);
	}
}
