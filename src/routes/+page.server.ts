import type { PageServerLoad } from './$types';
import { tursoClient } from '$lib/turso';

const db = tursoClient();

export const load: PageServerLoad = async () => {
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

	return { ok: false, message: 'No questions found' };
};
