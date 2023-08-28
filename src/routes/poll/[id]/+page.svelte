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

{#if question !== undefined}
	<div class="flex flex-col gap-2 rounded p-3 lg:max-w-2xl mx-auto">
		<h1 class="text-xl lg:text-3xl font-serif font-thin">{question.question}</h1>
		<ol class="flex flex-col p-4 gap-2 mt-8 px-8">
			{#each question.choices as choice}
				<li class="flex w-full gap-4 items-center">
					<span class="font-mono w-fit shrink-0 flex items-center">{choice.choice}</span>
					<div class="grow overflow-x-hidden flex gap-3 items-center">
						{#each { length: 33 } as _, i}
							<span class="flex text-gray-400 items-center">.</span>
						{/each}
					</div>
					{#if question.hasVoted || expired}
						<span class="w-fit shrink-0 text-center">{choice.votes?.length || 0}</span>
					{:else}
						<form method="post" action="" class="w-1/4 shrink-0">
							<button
								class="bg-teal-100 hover:bg-teal-200 active:bg-teal-400 px-2 py-1 rounded text-teal-800"
								type="submit"
								name="choice_id"
								value={choice.id}
								title="vote for {choice.choice}"
							>
								vote
							</button>
						</form>
					{/if}
				</li>
			{/each}
		</ol>
		{#if true}
			<div class="px-2 py-1 border-t">Total votes: {totalVotes}</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col items-center justify-end gap-2 rounded p-3 min-h-[50vh]">
		<span class="text-9xl">🔍</span>
		<h1 class="text-3xl">{message}</h1>
	</div>
{/if}
