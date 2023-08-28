import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad, Actions, RequestEvent } from '../$types';
import { tursoClient } from '$lib/turso';
import { questions, choices, votes } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const config: Config = {
	runtime: 'edge'
};

export const ssr = true;

const db = tursoClient();

export const load: PageServerLoad = async ({
	cookies
}): Promise<{ userId: string | undefined }> => {
	const userId = cookies.get('userid');

	if (!userId) {
		cookies.set('userid', crypto.randomUUID(), { path: '/' });
	}

	return { userId };
};

export const actions = {
	default: async ({ cookies, request }: RequestEvent) => {
		if (!cookies.get('userid')) {
			cookies.set('userid', crypto.randomUUID(), { path: '/' });
		}

		const data = await request.formData();
		const questionDeleteId: string = data.get('question_delete_id') as unknown as string;

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

		// delete votes & choices
		if (pollQuestion.choices.length > 0) {
			pollQuestion.choices.forEach(async (choice) => {
				if (choice.votes.length) {
					const deletedVotes = await db
						.delete(votes)
						.where(eq(votes.choiceId, choice.id))
						.returning()
						.all();
					console.log(JSON.stringify({ deletedVotes }));
				}

				const deletedChoice = await db
					.delete(choices)
					.where(eq(choices.id, choice.id))
					.returning()
					.all();
				console.log(JSON.stringify({ deletedChoice }));
			});
		}

		// delete question
		const deletedQn = await db
			.delete(questions)
			.where(eq(questions.id, pollQuestion.id))
			.returning()
			.get();
		console.log(JSON.stringify({ deletedQn }));

		return { ok: true, message: 'Poll deleted!' };
	}
} satisfies Actions;
