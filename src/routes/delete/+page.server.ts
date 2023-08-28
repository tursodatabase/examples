import type { PageServerLoad, Actions, RequestEvent } from '../$types';
import { tursoClient } from '$lib/server/turso';
import { questions, choices, votes } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies }) => {
	const userId = cookies.get('userid');

	if (!userId) {
		cookies.set('userid', crypto.randomUUID(), { path: '/' });
	}
};

export const actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const questionDeleteId: string = data.get('question_delete_id') as unknown as string;

		const db = tursoClient();

		// get question
		const pollQuestion = await db.query.questions.findFirst({
			where: (questions, { eq }) => eq(questions.deleteId, questionDeleteId),
			with: {
				choices: {
					with: {
						votes: true
					}
				}
			}
		});

		if (pollQuestion === undefined) {
			return { ok: false, message: 'Unknown delete id!' };
		}

		if (pollQuestion.choices.length > 0) {
			pollQuestion.choices.forEach(async (choice) => {
				if (choice.votes.length) {
					await db.delete(votes).where(eq(votes.choiceId, choice.id)).returning().all();
				}

				await db.delete(choices).where(eq(choices.id, choice.id)).run();
			});
		}

		await db.delete(questions).where(eq(questions.id, pollQuestion.id)).returning().get();

		return { ok: true, message: 'Poll deleted!' };
	}
} satisfies Actions;
