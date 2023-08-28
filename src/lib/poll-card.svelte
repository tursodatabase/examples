<script lang="ts">
	import type { Question } from './types';

	export let question: Question;
	let totalVotes = 0;
	question.choices.forEach((choice) => {
		totalVotes += choice.votes?.length || 0;
	});

	const expired = Number((Date.now() / 1000).toFixed(0)) > question.expireDate;
</script>

<li class="flex flex-col gap-2 border rounded p-1">
	<a href="/poll/{question.id}"
		><h3 class="text-xl font-serif font-thin bg-gray-50 hover:bg-gray-100 p-2">
			{question.question}
		</h3></a
	>
	<ul class="flex flex-wrap gap-4 px-2 py-1">
		{#each question.choices as choice}
			<li class="p-2 rounded-lg flex">
				<span class="bg-teal-200 p-2 rounded-l-lg outline outline-teal-200 min-w-fit">
					{choice.choice}
				</span>
				<span class="w-full h-full p-2 bg-white rounded-r outline outline-teal-200">
					{totalVotes
						? (((choice.votes?.length || 0) / totalVotes) * 100).toFixed(0)
						: choice.votes?.length}%
				</span>
			</li>
		{/each}
	</ul>
	{#if expired}
		<div class="px-2 py-1 border-t">Total votes: {totalVotes}</div>
	{/if}
</li>
