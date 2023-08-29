<script lang="ts">
  import type { PageData } from './$types';
  import { PollCard } from '$lib';
  const title = 'Turso at the Polls';

  export let data: PageData;
  export let { questions } = data;
</script>

<section class="flex justify-center">
  <h1 class="text-2xl font-bold mb-8">{title}</h1>
</section>

{#if questions.length}
  <ul class="flex flex-col gap-4 p-2w-full lg:max-w-2xl mx-auto">
    {#each questions as question (question.id)}
      <PollCard {question} />
    {/each}
  </ul>
{:else}
  <div class="flex flex-col items-center">
    <p class="p-4">No polls have been added</p>
    <a
      class="p-2 rounded bg-teal-100 hovwr:bg-teal-100 active:bg-teal-300 text-teal-700"
      href="/new">Add a Poll</a
    >
  </div>
{/if}
