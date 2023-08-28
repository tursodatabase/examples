import { error, type Actions, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { tursoClient } from '$lib/turso';
import { votes } from '../../../../drizzle/schema';

export const config: Config = {
	runtime: 'edge'
};

export const ssr = true;

const db = tursoClient();

export const load: PageServerLoad = async ({ params, cookies }) => {
	if (!cookies.get('userid')) {
		cookies.set('userid', crypto.randomUUID(), { path: '/' });
	}
	const userId = cookies.get('userid') as string;

	const { id }: { id?: string } = params;

	if (id === undefined) {
		throw error(404, 'Not Found');
	}

	const question = await db.query.questions.findFirst({
		where: (questions, { eq }) => eq(questions.id, id),
		with: {
			choices: {
				with: {
					votes: true
				}
			}
		}
	});

	// check if voted
	let hasVoted = false;

	const userVotes = await db.query.votes.findMany({
		where: (votes, { eq }) => eq(votes.voterId, userId),
		with: {
			choice: true
		}
	});

	userVotes.forEach((votes) => {
		if (votes.choice.questionId === id) {
			hasVoted = true;
		}
	});

	if (question !== undefined) {
		return { question: { ...question, hasVoted } };
	}

	throw error(404, 'Not found');
};

export const actions = {
	default: async ({ cookies, request }: RequestEvent) => {
		if (!cookies.get('userid')) {
			cookies.set('userid', crypto.randomUUID(), { path: '/' });
		}
		const userId = cookies.get('userid') as string;

		const data = await request.formData();
		const choiceId: string = data.get('choice_id') as unknown as string;

		const vote = {
			id: crypto.randomUUID() as unknown as string,
			choiceId,
			country: 'unknown',
			voterId: userId
		};

		// check if voted
		const alreadyVoted = await db.query.votes.findFirst({
			where: (votes, { eq, and }) => and(eq(votes.choiceId, choiceId), eq(votes.voterId, userId))
		});

		let voteData = {};
		if (alreadyVoted === undefined) {
			// add vote
			voteData = await db.insert(votes).values(vote).returning().get();
			console.log(JSON.stringify(voteData));
		}

		return JSON.stringify({ voteData });
	}
} satisfies Actions;
