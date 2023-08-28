import { HttpError_1, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { tursoClient } from '$lib/turso';
import type { Choice, Question } from '../lib/types';

export const config: Config = {
	runtime: 'edge'
};

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
