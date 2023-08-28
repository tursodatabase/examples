import type { PageServerLoad } from './$types';
import { tursoClient } from '$lib/server/turso';

export const load: PageServerLoad = async () => {
	const db = tursoClient();

	const questions = await db.query.questions.findMany({
		with: {
			choices: {
				with: {
					votes: true
				}
			}
		}
	});

	if (questions !== undefined) {
		return { questions };
	}

	return { questions: [] };
};
