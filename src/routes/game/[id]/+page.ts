import { getGame } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { browser } from '$app/environment';

export const load: PageLoad = async ({ params, fetch }) => {
	console.log('fetch', browser ? 'browser' : 'server', new Date().getTime() / 1000);
	console.log(Date.now().toLocaleString('de'));
	const res = await fetch(`${PUBLIC_SERVER_URL}/getGame/${params.id}`);
	if (res.status === 404) {
		const errorData = await res.json();
		console.log(error);

		error(404, {
			message: errorData.message
		});
	}
	const { game, players } = await res.json();
	console.log('fetchFinished', new Date().getTime() / 1000);

	return {
		game,
		players
	};
};
