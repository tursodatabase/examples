import type { Config } from '@sveltejs/adapter-vercel';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions, RequestEvent } from '../$types';
import date from 'date-and-time';
import { tursoClient } from '$lib/turso';
import { questions, choices } from './../../../drizzle/schema';

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
		const userId = cookies.get('userid');

		const data = await request.formData();
		const pollChoicesCount: number = data.get('choices_count') as unknown as number;
		const question = data.get('question') as unknown as string;
		const days = data.get('days') as unknown as number;
		const hours = data.get('hours') as unknown as number;
		const minutes = data.get('minutes') as unknown as number;

		let expireTime = date.addDays(new Date(), days);
		expireTime = date.addHours(expireTime, hours);
		expireTime = date.addMinutes(expireTime, minutes);
		const timeDiffToSecs: number = date.subtract(expireTime, new Date()).toSeconds();
		const expireDate = Number((Date.now() / 1000 + timeDiffToSecs).toFixed(0));

		const pollChoices = [];

		if (!question) {
			return fail(400, { question, missing: true });
		}

		const id = crypto.randomUUID();
		const deleteId = crypto.randomUUID();

		const questionInsertValues = {
			id,
			question,
			deleteId,
			expireDate
		};

		// add question
		const questionData = await db.insert(questions).values(questionInsertValues).returning().get();

		let i = 0;
		while (i < pollChoicesCount) {
			if (data.get(`choice_${i}`) !== '') {
				const id = crypto.randomUUID();
				pollChoices.push({
					id,
					choice: data.get(`choice_${i}`) as unknown as string,
					userId,
					questionId: questionData.id
				});
			}
			i++;
		}

		// add choices
		await db.insert(choices).values(pollChoices).run();

		return { ok: true, message: 'Poll added', deleteId: questionData.deleteId };
	}
} satisfies Actions;
