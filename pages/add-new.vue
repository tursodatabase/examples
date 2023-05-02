<script setup>
const form = reactive({
  name: "",
  language: "",
  githubLink: "",
  githubStarsCount: 0
});
const loading = ref(false);
const status = reactive({
  message: "",
  type: ""
});

/**
 * @description Submits new frameworks to the database
 */
async function addNewFramework(){
  const { name, language, githubLink: url, githubStarsCount: stars } = form;

  let message = ""
  if(!name)
    message += " 'name'"
  if(!language)
    message += " 'language'"
  if(!url)
    message += " 'Github link'"  
  if(!stars)
    message += " 'stars count'"
  if(message){
    status.message = "Fill in the:" + message;
    status.type = "success";
    return;
  }
  
  loading.value = true;
  
  const { data: responseData, error } = await useFetch('/api/add', {
    method: 'post',
    body: {name, language, url, stars}
  });
  loading.value = false;
  
  if(!error.value){
    status.message = "Thanks for your contribution";
    status.type = "success";
    form.name = ""
    form.language = ""
    form.githubLink = ""
    form.githubStarsCount = 0
  }
  if(error.value){
    status.message = error.value.data.message.includes("UNIQUE constraint") ? "Framework exists!" : error.value.data.message;
    status.type = "error";
  }
  if(status.message)
    setTimeout(() => {
      status.message = "";
      status.type = "";
    }, 5000);
}

useSeoMeta({
  title: "Contribute to the frameworks list"
})
</script>

<template>

  <h1>Submit a framework</h1>

  <div class="px-4 md:px-8 lg:px-12">
    <div v-show="status.message"
      class="p-2 px-4"
      :class="{'text-green-800 bg-green-300': status.type === 'success', 'text-red-800 bg-red-200': status.type === 'error'}"  
    >
      {{ status.message }}
    </div>
    <form action="" @submit.prevent="addNewFramework">
      <div>
        <label for="UserEmail" class="block text-xs font-medium text-gray-700">
          Name
        </label>

        <input
          type="text"
          name="name"
          v-model="form.name"
          placeholder="Framework name"
          class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label for="UserEmail" class="block text-xs font-medium text-gray-700">
          Language
        </label>

        <input
          type="text"
          name="language"
          v-model="form.language"
          placeholder="Programming Language"
          class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label for="UserEmail" class="block text-xs font-medium text-gray-700">
          Github
        </label>

        <input
          type="text"
          name="github_link"
          v-model="form.githubLink"
          placeholder="GitHub link"
          class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label for="UserEmail" class="block text-xs font-medium text-gray-700">
          Stars count
        </label>

        <input
          type="text"
          name="github_stars_count"
          v-model="form.githubStarsCount"
          placeholder="GitHub stars count"
          class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
      </div>
      
      <div class="flex justify-center p-2">
        <button
          type="submit"
          class="py-2 px-4 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 focus:relative flex space-x-2 justify-between items-center"
          title="View Orders"
        >
          <span>Submit</span>
          <svg
            v-if="loading"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-4 h-4 animate-spin fill-white"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>