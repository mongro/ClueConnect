import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, request, params }) => {
	let lang = cookies.get('lang');
	const id = params.id;
	if (!lang) {
		lang = request.headers.get('accept-language')?.split(',')[0];
	}

	return { lang, id };
};
