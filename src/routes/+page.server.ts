import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	return {
		serverTimestamp: new Date().toISOString(),
		cfCountry: (platform?.cf?.country as string) ?? 'Local/Dev'
	};
};
