import { component$, Slot } from "@builder.io/qwik";

import Header from "../components/header/header";

export default component$(() => {
  return (
    <div class="flex flex-col">
      <main class="flex-grow">
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer class="flex-shrink-0 flex justify-center text-gray-600 max-h-48">
        <p>
          Built with{" "}
          <a href="https://qwik.builder.io" target="_blank">
            Qwik
          </a>{" "}
          &{" "}
          <a href="https://chiselstrike.com" target="_blank">
            Turso
          </a>
          .
        </p>
      </footer>
    </div>
  );
});
