<template>
  <nav
    class="py-2 px-4 flex space-x-2"
  >
    <NuxtLink to="/" class="font-semibold">Home</NuxtLink>
    <NuxtLink to="/add-new" class="font-semibold">Add New</NuxtLink>
    <NuxtLink to="/about" class="font-semibold">About</NuxtLink>
  </nav>
  <main class="p-4 flex flex-col space-y-6">
    <slot/>

    <div class="text-gray-400 text-center pt-6">
      Built with <a href="https://nuxt.com">Nuxt</a> and <a href="https://turso.tech">Turso</a>.
    </div>
  </main>
</template>