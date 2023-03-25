<script setup>
import axios from "axios"
axios.defaults.headers["Authorization"] = `Bearer ${import.meta.env.VITE_TURSO_DB_TOKEN}`

/** 
 * @description Turso data response formatter
 * @param {Object} data - Turso http results objecy
 */
function responseDataAdapter(data) {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso");
  }

  const { columns, rows } = data;
  const formattedData = [];

  for (const row of rows) {
    const rowData = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }
    formattedData.push(rowData);
  }

  return formattedData;
}

const statements = ["select * from frameworks order by stars desc"];

const frameworks = ref([]);

/**
 * @description Loads frameworks list from database
 */
async function loadFrameworks() {
  try{
    const {data} = await axios.post(import.meta.env.VITE_TURSO_DB_URL, {
      statements
    });
    const formatedData = responseDataAdapter(data[0].results);
    frameworks.value = formatedData;
  } catch (error) {
    console.log(error)
  }

}

// Lifecycle hook called when the component is mounted to the DOM (https://vuejs.org/api/composition-api-lifecycle.html#onmounted)
onMounted(() => {
  loadFrameworks();
})

// Async data fetch using Nuxt's useAsyncData composable (https://nuxt.com/docs/api/composables/use-async-data)
const {data: frameworksList} = await useAsyncData('dishes', async () => await axios.post(import.meta.env.VITE_TURSO_DB_URL, { statements }), {
    transform: (result) => responseDataAdapter(result.data[0].results)
})


</script>

<template>
  
  <h1>Top frameworks for the Web</h1>

  <h3>(Fetched using a regular async function)</h3>
  <ul v-if="frameworks">
    <li v-for="framework of frameworks"> {{ framework.name }} | {{ framework.stars }} ⭐️ </li>
  </ul>

  <hr>

  <h3>(Fetched using <a href="https://nuxt.com/docs/api/composables/use-async-data">useAsyncData</a>)</h3>
  <ul v-if="frameworksList">
    <li v-for="framework of frameworksList"> {{ framework.name }} | {{ framework.stars }} ⭐️ </li>
  </ul>

</template>