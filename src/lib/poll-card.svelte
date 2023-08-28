<script lang="ts">
	import type { Question } from './types';

	export let question: Question;
	let totalVotes = 0;
	question.choices.forEach((choice) => {
		totalVotes += choice.votes?.length || 0;
	});
</script>

<li class="flex flex-col gap-2 border rounded p-3">
	<h3 class="text-xl font-serif font-thin">{question.question}</h3>
	<ul class="flex flex-wrap gap-4">
		{#each question.choices as choice}
			<li class="p-2 rounded-lg flex">
				<span class="bg-teal-200 p-2 rounded-l-lg outline outline-teal-200 min-w-fit">
					{choice.choice}
				</span>
				<span class="w-full h-full p-2 bg-white rounded-r outline outline-teal-200">
					{totalVotes ? (choice.votes?.length || 0 / totalVotes) * 100 : choice.votes?.length}%
				</span>
			</li>
		{/each}
	</ul>
</li>
