import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';


export default component$(() => {
  return (
    <section>
      <div class="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div class="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
            <div class="max-w-md mx-auto text-center lg:text-left">
              <header>
                <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">TurQw Store</h2>

                <p class="mt-4 text-gray-500">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
                  rerum quam amet provident nulla error!
                </p>
              </header>

              <a
                href="#"
                class="inline-block px-12 py-3 mt-8 text-sm font-medium text-white transition bg-gray-900 border border-gray-900 rounded hover:shadow focus:outline-none focus:ring"
              >
                Shop All
              </a>
            </div>
          </div>

          <div class="lg:col-span-2 lg:py-8">
            <ul class="grid grid-cols-2 gap-4">
              <li>
                <a href="/category/furniture" class="block group">
                  <img
                    src="/furniture.jpeg"
                    alt=""
                    class="object-cover w-full rounded aspect-square"
                  />

                  <div class="mt-3">
                    <h3
                      class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4"
                    >
                      Furniture
                    </h3>

                    <p class="mt-1 text-sm text-gray-700">Decorate your house with classic pieces</p>
                  </div>
                </a>
              </li>

              <li>
                <a href="/category/electronics" class="block group">
                  <img
                    src="/electronics.jpeg"
                    alt=""
                    class="object-cover w-full rounded aspect-square"
                  />

                  <div class="mt-3">
                    <h3
                      class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4"
                    >
                      Electronics
                    </h3>

                    <p class="mt-1 text-sm text-gray-700">Gadgets to automate your life</p>
                  </div>
                </a>
              </li>

              <li class="col-span-2">
                <a href="/category/clothing" class="block group">
                  <img
                    src="/clothing.jpeg"
                    alt=""
                    class="object-cover w-full rounded aspect-square"
                  />

                  <div class="mt-3">
                    <h3
                      class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4"
                    >
                      Clothes
                    </h3>

                    <p class="mt-1 text-sm text-gray-700">Look stylist wearing top fashion brands</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  );
});

export const head: DocumentHead = {
  title: 'TurQw shopping Cart',
  meta: [
    {
      name: 'description',
      content: 'A shopping cart built with Qwik and Turso',
    },
  ],
};
