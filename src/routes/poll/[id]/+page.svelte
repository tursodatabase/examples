<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	export let { question, ok, message } = data;
	let totalVotes = 0;
	question?.choices.forEach((choice) => {
		totalVotes += choice.votes?.length || 0;
	});

	let expired =
		Number((Date.now() / 1000).toFixed(0)) > (question?.expireDate as unknown as number);
</script>

<li class="flex flex-col gap-2 border rounded p-3">
	<h3 class="text-xl font-serif font-thin">{question.question}</h3>
	<ol class="flex flex-col p-4 gap-2">
		{#each question.choices as choice}
			<li class="flex gap-4 items-center">
				<span class="font-mono">{choice.choice}</span>
				{#if question.hasVoted || expired}
					{choice.votes?.length || 0}
				{:else}
					<form method="post" action="">
						<button
							class="bg-teal-100 hover:bg-teal-200 active:bg-teal-400 px-2 py-1 rounded text-teal-800"
							type="submit"
							name="choice_id"
							value={choice.id}
						>
							vote
						</button>
					</form>
				{:else}
					{choice.votes.length}
				{/if}
			</li>
		{/each}
	</ol>
</li>
