<script setup>
const { data } = await useFetch('/api/frameworks');
const { data: frameworks, message } = data.value;

const formatNumber = (val) => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(val);

</script>

<template>
  
  <h1 class="text-2xl font-bold text-center">Top Web Frameworks</h1>

  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y-2 divide-gray-200 text-sm">
      <caption class="py-2">The list of top web frameworks</caption>
      <thead>
        <tr>
          <th
            class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
          >
            Name
          </th>
          <th
            class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
          >
            Language
          </th>
          <th
            class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
          >
            GitHub Stars
          </th>
          <th
            class="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
          >
            Repo
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200" v-if="frameworks">
        <tr v-for="framework of frameworks">
          <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            {{ framework.name }} 
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700"> {{ framework.language }} </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700"> {{ formatNumber(framework.stars) }} ⭐️ </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <a :href="framework.url" target="_blank" class="p-1 text-center px-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-md">Visit</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>