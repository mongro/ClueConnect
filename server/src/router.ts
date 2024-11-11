import lobbyDb from './LobbyDB';
import { Router } from 'express';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { Lobby } from './Lobby';

const router = Router();

const createLobby = (req: Request, res: Response) => {
	try {
		console.log('create', req);
		const { name } = req.body;
		console.log('body', req.body);
		let id = crypto.randomUUID();
		let attempts = 0;
		while (lobbyDb.get(id) && attempts < 15) {
			id = crypto.randomUUID();
			attempts++;
		}
		if (attempts === 15) res.status(200).json({ success: false });
		const lobby = new Lobby(id);
		const credentials = lobby.addPlayer(name);
		if (credentials) {
			lobbyDb.add(id, lobby);
			res.status(200).json({ success: true, credentials, lobbyId: id });
		}
		res.status(200).json({ success: false });
	} catch (error) {
		console.error('Error in createRoom:', error);
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
		if (credentials) res.status(200).json({ success: true, credentials, lobbyId });
		res.status(200).json({ success: false, message: 'Not allowed to join lobby.' });
	} catch (error) {
		console.error('Error in createRoom:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

router.post('/createLobby', createLobby);
router.post('/joinLobby', joinLobby);

export default router;
