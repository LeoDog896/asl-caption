import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const backend = import.meta.env.VITE_BACKEND_URL;

	const response = await fetch(`${backend}/hello`);
	const data = await response.json();

	return {
		message: data.message
	};
}) satisfies PageLoad;
