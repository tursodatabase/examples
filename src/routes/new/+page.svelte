<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { LoaderIcon, PlusIcon } from '$lib';

  interface ChoicesType {
    name: string;
    value: string;
  }

  export let form: { ok: boolean; message: string; deleteId: string };

  let choices: ChoicesType[] = [
    { name: 'choice_0', value: '' },
    { name: 'choice_1', value: '' }
  ];

  let choicesCount: number = 2;
  let isSubmitting = false;

  function addChoice(ev: Event) {
    ev.preventDefault();
    if (choicesCount < 10) {
      choices = [...choices, { name: `choice_${choicesCount}`, value: '' }];
      choicesCount++;
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

<h1 class="text-2xl tect-center flex justify-center">New Poll</h1>

<form
  method="post"
  class="p-2 lg:p-8 flex flex-col gap-4 max-w-xl mx-auto"
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
      <div class="p-2 bg-green-200 rounded text-green-700 flex gap-2">
        <span>{form.message}</span> <span>(deleteId: {form.deleteId})</span>
      </div>
    {:else if !form?.ok && form?.message}
      <div class="p-2 bg-red-200 rounded text-red-700 mx-auto w-fit">{form.message}</div>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="">Question</label>
    <textarea name="question" required rows="3" />
  </div>
  <div class="flex flex-col gap-2">
    {#each choices as choice, i}
      <div class="flex flex-col gap-2">
        <div>
          <label for=""
            >Choice {i + 1} <span class="text-gray-400">{i > 1 ? '(Optional)' : ''}</span></label
          >
        </div>
        <div class="flex gap-4">
          <div class="flex w-full relative">
            <input
              class="w-full grow"
              type="text"
              name={choice.name}
              bind:value={choice.value}
              max="20"
              required={i < 2}
              on:input={() => validateLength(i)}
            />
            <span class="absolute right-2 h-full flex items-center justify-center text-gray-400"
              >({choice.value.length} / 20)</span
            >
          </div>
          {#if choicesCount === i + 1}
            <button
              type="button"
              class="shrink-0 w-8 flex items-center justify-center"
              on:click={addChoice}
            >
              <PlusIcon styles="w-5 h-5 fill-blue-600 hover:fill-blue-700" />
            </button>
          {/if}
        </div>
      </div>
    {/each}
    <div>
      <label for="">Poll Duration</label>
      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-gray-500 text-sm" for="">Days</label>
          <select name="days">
            {#each { length: 10 } as _, i}
              <option value={i}>{i}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-gray-500 text-sm" for="">Hours</label>

          <select name="hours">
            {#each { length: 24 } as _, i}
              <option selected={i === 1} value={i}>{i}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-gray-500 text-sm" for="">Minutes</label>
          <select name="minutes">
            {#each { length: 60 } as _, i}
              <option value={i}>{i}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <input type="hidden" name="choices_count" value={choicesCount} />
  </div>
  <div class="flex justify-center">
    <button
      type="submit"
      class=" w-32 p-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded text-white flex justify-center items-center gap-1"
    >
      {#if isSubmitting}
        <LoaderIcon styles="w-3 h-3 fill-white" />
      {/if} <span>Add Poll</span></button
    >
  </div>
</form>

<style>
  input {
    @apply outline outline-1 outline-gray-400 rounded p-2;
  }
  select,
  textarea {
    @apply p-2 rounded bg-transparent outline outline-1 outline-gray-400;
  }
  textarea {
    @apply resize-none;
  }
</style>
