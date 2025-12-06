import lobbyDb from './LobbyDB';
import { Router } from 'express';
import { Request, Response } from 'express';
import { Lobby } from './Lobby';

const router = Router();

const getGame = (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const lobby = lobbyDb.get(id);
		if (!lobby) {
			res.status(404).json({ message: 'Lobby not found' });
			return;
		}
		res.status(200).json({ game: lobby.game, players: lobby.playersAll });
	} catch (error) {
		console.error('Error in createLobby:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const createLobby = (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		let id = Math.random().toString(36).slice(-6);
		let attempts = 0;
		while (lobbyDb.get(id) && attempts < 15) {
			id = Math.random().toString(36).slice(-6);
			attempts++;
		}
		if (attempts === 15) {
			res.status(200).json({ success: false });
			return;
		}
		const lobby = new Lobby(id);
		const credentials = lobby.addPlayer(name);
		if (credentials) {
			lobbyDb.add(id, lobby);
			res.status(200).json({ success: true, credentials, lobbyId: id });
			return;
		}
		res.status(200).json({ success: false });
	} catch (error) {
		console.error('Error in createLobby:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const joinLobby = (req: Request, res: Response) => {
	try {
		const { name, lobbyId } = req.body;
		const lobby = lobbyDb.get(lobbyId);
		if (!lobby) {
			res
				.status(200)
				.json({ success: false, message: 'Lobby doesnt exist', lobby: lobbyDb.keys, key: lobbyId });
			return;
		}
		const credentials = lobby.addPlayer(name);
		if (credentials) {
			res.status(200).json({ success: true, credentials, lobbyId });
			return;
		}

		res.status(200).json({ success: false, message: 'Not allowed to join lobby.' });
	} catch (error) {
		console.error('Error in joinLobby:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

router.post('/createLobby', createLobby);
router.post('/joinLobby', joinLobby);
router.get('/getGame/:id', getGame);
router.get('/', function (req, res) {
	res.send('hello world');
});

export default router;
