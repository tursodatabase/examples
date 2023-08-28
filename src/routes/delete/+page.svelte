<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import LoaderIcon from '$lib/loader-icon.svelte';

	interface ChoicesType {
		name: string;
		value: string;
	}

	export let form: { ok: boolean; message: string };
	let isSubmitting = false;

	let choices: ChoicesType[] = [
		{ name: 'choice_0', value: '' },
		{ name: 'choice_1', value: '' }
	];

	let choicesCount: number = 2;

	function addChoice(ev: Event) {
		ev.preventDefault();
		console.log('Adding a choice: ', { choicesCount });
		if (choicesCount < 10) {
			choices = [...choices, { name: `choice_${choicesCount}`, value: '' }];
			choicesCount++;
			console.log('Choice added ', { choices });
			return;
		}
		console.log("Can't have more than 10 choices");
	}

	function validateLength(index: number) {
		if (choices[index].value.length >= 20) {
			choices[index].value = choices[index].value.slice(0, 20);
		}
	}
</script>

<h1 class="text-2xl tect-center flex justify-center mb-4">Delete poll</h1>

<form
	method="post"
	class="p-2 lg:p-8 flex flex-col gap-4 max-w-xl mx-auto mt-32"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ result }) => {
			await applyAction(result);
			isSubmitting = false;
		};
	}}
>
	<div>
		{#if form?.ok}
			<div class="p-2 bg-green-200 rounded text-green-700">{form.message}</div>
		{:else if !form?.ok && form?.message}
			<div class="p-2 bg-red-200 rounded text-red-700 mx-auto w-fit">{form.message}</div>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		<input name="question_delete_id" required placeholder="Poll delete id" />
	</div>
	<div class="flex justify-center">
		<button
			type="submit"
			class=" w-32 p-2 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded text-white flex justify-center items-center gap-1"
		>
			{#if isSubmitting}
				<LoaderIcon styles="w-3 h-3 fill-white" />
			{/if} <span>Delete</span>
		</button>
	</div>
</form>

<style>
	input {
		@apply outline outline-1 outline-gray-400 rounded p-2;
	}
</style>
