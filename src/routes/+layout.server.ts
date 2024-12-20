import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, request }) => {
	let lang = cookies.get('lang');
	console.log('cookies', lang);
	if (!lang) {
		lang = request.headers.get('accept-language')?.split(',')[0];
	}

	return { lang };
};
