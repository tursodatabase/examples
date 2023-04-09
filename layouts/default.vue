<template>
  <nav
    class="py-2 px-4 flex space-x-2"
  >
    <NuxtLink to="/" class="text-blue-600 hover:text-blue-700 font-semibold">Home</NuxtLink>
    <NuxtLink to="/add-new" class="text-blue-600 hover:text-blue-700 font-semibold">Add New</NuxtLink>
    <NuxtLink to="/about" class="text-blue-600 hover:text-blue-700 font-semibold">About</NuxtLink>
  </nav>
  <main class="p-4 flex flex-col space-y-6">
    <slot/>
  </main>
</template>