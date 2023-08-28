<script lang="ts">
	import type { PageData } from './$types';
	import { PollCard } from '$lib';
	import type { Question } from '../lib/types';
	const title = 'Turso at the Polls';

	export let data: PageData;
	export let { questions }: { questions?: Question[] } = data;
</script>

<section class="flex justify-center">
	<h1>{title}</h1>
</section>

{#if questions !== undefined && questions}
	<ul class="flex flex-col gap-4">
		{#each questions as question (question.id)}
			<PollCard {question} />
		{/each}
	</ul>
{/if}
