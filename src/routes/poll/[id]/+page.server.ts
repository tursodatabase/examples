import type { Actions } from '@sveltejs/kit';
import { geolocation } from '@vercel/edge';
import type { PageServerLoad } from '../$types';
import { tursoClient } from '$lib/server/turso';
import { votes } from '../../../../drizzle/schema';
import type { Question } from '$lib/types';

const db = tursoClient();

export const load: PageServerLoad = async ({
  params,
  cookies
}): Promise<{ question: Question & { hasVoted: boolean } } | { ok: boolean; message: string }> => {
  if (!cookies.get('userid')) {
    cookies.set('userid', crypto.randomUUID(), { path: '/' });
  }
  const userId = cookies.get('userid') as string;

  const { id }: { id?: string } = params;

  if (id === undefined) {
    return { ok: false, message: 'Poll id not provided' };
  }
  const db = tursoClient();

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

  return { ok: false, message: 'Poll not found!' };
};

export const actions = {
  default: async ({ cookies, request }) => {
    if (!cookies.get('userid')) {
      cookies.set('userid', crypto.randomUUID(), { path: '/' });
    }
    const userId = cookies.get('userid') as string;

    const data = await request.formData();
    const choiceId: string = data.get('choice_id') as unknown as string;

    const { country } = geolocation(request);

    const vote = {
      id: crypto.randomUUID() as unknown as string,
      choiceId,
      country: country || 'unknown',
      voterId: userId
    };

    // check if voted
    const alreadyVoted = await db.query.votes.findFirst({
      where: (votes, { eq, and }) => and(eq(votes.choiceId, choiceId), eq(votes.voterId, userId))
    });

    if (alreadyVoted === undefined) {
      // add vote
      await db.insert(votes).values(vote).run();
    }

    return { ok: true, message: 'Voted' };
  }
} satisfies Actions;
